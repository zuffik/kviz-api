import { IStorage } from "./Storage";
import { Answer, Question, Quiz, UploadedFile, User, UserAnsweredQuestion, UserAnsweredQuiz } from "../index";
import * as mongodb from 'mongodb';
import { Db, ObjectID } from 'mongodb';
import * as _ from "lodash";
import * as password_hash from 'password_hash';
import * as moment from "moment";

const compat = (value: any) => {
    if (value && value._id && typeof value._id !== 'string') {
        value._id = value._id.toHexString();
    }
    return value;
};

const toObjectId = (value: any) => {
    if (value && value._id && typeof value._id === 'string') {
        value._id = new ObjectID(value._id);
    }
    return value;
};

export class MongoDBStorage implements IStorage<string> {
    public static url: string;
    private storage: Db;

    init(): Promise<void> {
        return new Promise<void>((res, rej) => {
            mongodb.connect(MongoDBStorage.url, async (e, client) => {
                if (e) {
                    rej(e);
                }
                this.storage = client.db('quizzes');
                if (!this.storage.collection('quizzes')) {
                    await this.storage.createCollection('quizzes');
                }
                if (!this.storage.collection('questions')) {
                    await this.storage.createCollection('questions');
                }
                if (!this.storage.collection('answers')) {
                    await this.storage.createCollection('answers');
                }
                if (!this.storage.collection('users')) {
                    await this.storage.createCollection('users');
                }
                if (!this.storage.collection('answeredQuizzes')) {
                    await this.storage.createCollection('answeredQuizzes');
                }
                if (!this.storage.collection('files')) {
                    await this.storage.createCollection('files');
                }
                res();
            });
        });
    }

    async createAnswer(answer: Answer<string>): Promise<Answer<string>> {
        const res = await this.storage.collection('answers').insertOne(answer);
        answer._id = res.insertedId.toHexString();
        return answer;
    }

    async createQuestion(question: Question<string>, answers: string[]): Promise<Question<string>> {
        const res = await this.storage.collection('questions').insertOne({
            ...question,
            answers
        });
        question._id = res.insertedId.toHexString();
        return question;
    }

    async deleteQuiz(_id: string) {
        const quiz = await this.storage.collection('quizzes').findOne({_id});
        await this.storage.collection('quizzes').deleteOne({
            _id: new ObjectID(_id)
        });
        return quiz;
    }

    async createQuiz(quiz: Quiz<string>, questions: string[]): Promise<Quiz<string>> {
        if (questions) {
            const res = await this.storage.collection('quizzes').insertOne({
                ...quiz,
                questions
            });
            quiz._id = res.insertedId.toHexString();
            return quiz;
        }
        const questionList = await Promise.all((quiz.questions || []).map(
            async (question: Question<string>) => {
                const answers = await Promise.all((question.answers || []).map(
                    this.createAnswer.bind(this) as (a: Answer<string>) => Answer<string>)
                );
                return await this.createQuestion(question, (answers || []).map(a => a._id as string));
            }));
        return this.createQuiz(quiz, (questionList || []).map(q => q._id as string));
    }

    async createUser(user: User<string>): Promise<User<string>> {
        if (user.password) {
            user.password = password_hash(user.password).hash(process.env.PASSWORD_SALT);
        }
        const res = await this.storage.collection('users').insertOne(user);
        user._id = res.insertedId.toHexString();
        return user;
    }

    async getQuizzes(filter?: { _id?: string }): Promise<Quiz<string>[]> {
        return await Promise.all((await this.storage.collection('quizzes').find(toObjectId(filter)).toArray())
            .map(async q => ({
                    ...q,
                    _id: q._id.toString(),
                    image: compat(typeof q.image === 'string' ?
                        await this.storage.collection('files').findOne({_id: new ObjectID(q.image)}) : q.image),
                    questions: await Promise.all((
                        await this.storage.collection('questions')
                            .find({_id: {$in: (q.questions || []).map((i: any) => new ObjectID(i))}}).toArray()
                    ).map(async qu => ({
                        ...qu,
                        _id: qu._id.toString(),
                        answers: (
                            (await this.storage.collection('answers').find({
                                _id: {$in: (qu.answers || []).map((i: any) => new ObjectID(i))}
                            }).toArray()).map(i => ({...i, _id: i._id.toString()}))
                        ),
                    })))
                })
            )
        );
    }

    async getUsers(filter?: { _id?: string }): Promise<User<string>[]> {
        return (await this.storage.collection('users').find(toObjectId(filter)).toArray()).map(compat);
    }

    async createUserAnswers(
        quiz: string,
        answers: { question: string, answer: string }[],
        textAnswers: { question: string, answer: string }[],
        user?: string
    ):
        Promise<UserAnsweredQuiz<string>> {
        answers = answers.filter(a => a.answer !== 'on');
        const q: Quiz = await this.storage.collection('quizzes').findOne({_id: new ObjectID(quiz)});
        let u: User | undefined;
        if (user) {
            u = await this.storage.collection('users').findOne({_id: new ObjectID(user)});
        }
        let questions: UserAnsweredQuestion<string>[] = await Promise.all((answers || []).map(async k => {
            const textAnswer = _.find(textAnswers, {question: k.question});
            textAnswers = (textAnswers || []).filter(a => a.question !== _.get(textAnswer, ['_id'], ''));
            return ({
                question: await this.storage.collection('questions').findOne({_id: new ObjectID(k.question)}),
                answers: await (await this.storage.collection('answers')
                    .find({_id: {$in: [new ObjectID(k.answer)]}})).toArray(),
                text: _.get(textAnswer, ['answer'], ''),
                createdAt: +moment()
            });
        }));
        questions = [...questions, ...(await Promise.all((textAnswers || []).map(async k => ({
            question: await this.storage.collection('questions').findOne({_id: new ObjectID(k.question)}),
            text: k.answer
        }))))];
        const ans = {
            quiz: q,
            user: u,
            questions,
            createdAt: +moment()
        } as UserAnsweredQuiz<string>;
        const res = await this.storage.collection('answeredQuizzes').insertOne({
            ...ans,
            quiz: ans.quiz._id,
            user: (ans.user || {_id: undefined})._id,
            questions: (ans.questions || []).map(q => ({
                _id: q.question._id,
                answers: (q.answers || []).map(a => a._id),
                text: q.text
            })),
        });
        ans._id = res.insertedId.toHexString();
        return ans;
    }

    async getUserAnswers(user?: string): Promise<UserAnsweredQuiz<string>[]> {
        const quizzes = _.uniq(_.flatten((await Promise.all((await this.storage.collection('answeredQuizzes')
            .find(user ? {user: new ObjectID(user)} : undefined).toArray())
            .map(async q => [
                q.quiz,
                ..._.values((await this.storage.collection('quizzes').findOne({_id: new ObjectID(q.quiz)})).replaces)
            ]))).map(q => q.map(qu => new ObjectID(qu)))));
        return await Promise.all((await Promise.all(await this.storage.collection('answeredQuizzes').find({
            quiz: {$in: quizzes}
        }).toArray())).map(async q => ({
            ...compat(q),
            quiz: compat(await this.storage.collection('quizzes').findOne({_id: new ObjectID(q.quiz)})),
            user: compat(await this.storage.collection('users').findOne({_id: new ObjectID(q.user)})),
            questions: (await this.storage.collection('questions').find({
                _id: {
                    $in: q.questions.map((i: any) => i._id)
                }
            }).toArray()).map(async qu => ({
                question: compat(qu),
                answers: (await this.storage.collection('answers')
                    .find({
                        _id: {
                            $in: q.questions.filter((i: any) => i._id !== qu._id)[0].answers
                                .map((i: any) => new ObjectID(i))
                        }
                    }).toArray())
                    .map(compat),
                text: q.questions.filter((i: any) => i._id !== qu._id)[0].text
            } as UserAnsweredQuestion))
        } as UserAnsweredQuiz<string>)));
    }

    async saveFile(file: Express.Multer.File): Promise<UploadedFile<string>> {
        const f: UploadedFile<string> = {
            file: file.filename,
            path: `/upload/${file.filename}`,
            createdAt: +moment()
        };
        const res = await this.storage.collection('files').insertOne(f);
        f._id = res.insertedId.toHexString();
        return f;
    }

    async getUserByName(name: string): Promise<User<string>> {
        return await this.storage.collection('users').findOne({name});
    }

    async updateQuiz(quiz: Quiz<string>, questions?: string[]): Promise<Quiz<string>> {
        const q = await this.storage.collection('quizzes').findOne({_id: new ObjectID(quiz._id)});
        if (!q) {
            throw new Error(`Quiz with _id: ${quiz._id} does not exists.`);
        }
        quiz.replaces = {
            ...q.replaces,
            [+moment()]: quiz._id
        };
        quiz.questions = (questions ? await this.storage.collection('questions').find({
            _id: {
                $in: questions.map(toObjectId)
            }
        }) : quiz.questions) as Question<string>[];
        quiz._id = undefined;
        quiz._id = (await this.storage.collection('quizzes').insertOne(quiz)).insertedId.toHexString();
        return quiz;
    }

    async getImages(): Promise<UploadedFile[]> {
        return (await this.storage.collection('files').find().toArray()).map(compat);
    }
}
