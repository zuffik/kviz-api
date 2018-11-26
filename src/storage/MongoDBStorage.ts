import { IStorage } from "./Storage";
import { Answer, Question, Quiz, UploadedFile, User, UserAnsweredQuestion, UserAnsweredQuiz } from "../index";
import * as mongodb from 'mongodb';
import { Db, ObjectID } from 'mongodb';
import * as _ from "lodash";
import * as password_hash from 'password_hash';

const compat = (value: any) => {
    if (value._id && typeof value._id !== 'string') {
        value._id = value._id.toHexString();
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

    async createQuiz(quiz: Quiz<string>, questions: string[]): Promise<Quiz<string>> {
        const res = await this.storage.collection('quizzes').insertOne({
            ...quiz,
            questions
        });
        quiz._id = res.insertedId.toHexString();
        return quiz;
    }

    async createUser(user: User<string>): Promise<User<string>> {
        if (user.password) {
            user.password = password_hash(user.password).hash(process.env.PASSWORD_SALT);
        }
        const res = await this.storage.collection('users').insertOne(user);
        user._id = res.insertedId.toHexString();
        return user;
    }

    async getQuizzes(): Promise<Quiz<string>[]> {
        return await Promise.all((await this.storage.collection('quizzes').find().toArray())
            .map(async q => ({
                    ...q,
                    _id: q._id.toString(),
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

    async getUsers(): Promise<User<string>[]> {
        return await this.storage.collection('users').find().toArray();
    }

    async createUserAnswers(
        user: string,
        quiz: string,
        answers: { question: string, answer: string }[],
        textAnswers: { question: string, answer: string }[]
    ):
        Promise<UserAnsweredQuiz<string>> {
        const q: Quiz = await this.storage.collection('quizzes').findOne({_id: new ObjectID(quiz)});
        const u: User = await this.storage.collection('users').findOne({_id: new ObjectID(user)});
        let questions: UserAnsweredQuestion<string>[] = await Promise.all((answers || []).map(async k => {
            const textAnswer = _.find(textAnswers, {question: k.question});
            textAnswers = textAnswers.filter(a => a.question !== _.get(textAnswer, ['_id'], ''));
            return ({
                question: await this.storage.collection('questions').findOne({_id: new ObjectID(k.question)}),
                answers: await (await this.storage.collection('answers')
                    .find({_id: {$in: [new ObjectID(k.answer)]}})).toArray(),
                text: _.get(textAnswer, ['answer'], '')
            });
        }));
        questions = [...questions, ...(await Promise.all((textAnswers || []).map(async k => ({
            question: await this.storage.collection('questions').findOne({_id: new ObjectID(k.question)}),
            text: k.answer
        }))))];
        const ans = {
            quiz: q,
            user: u,
            questions
        } as UserAnsweredQuiz<string>;
        const res = await this.storage.collection('answeredQuizzes').insertOne({
            ...ans,
            quiz: ans.quiz._id,
            user: ans.user._id,
            questions: ans.questions.map(q => ({
                _id: q.question._id,
                answers: (q.answers || []).map(a => a._id),
                text: q.text
            })),
        });
        ans._id = res.insertedId.toHexString();
        return ans;
    }

    async getUserAnswers(user?: string): Promise<UserAnsweredQuiz<string>[]> {
        return await Promise.all((await this.storage.collection('answeredQuizzes').find().toArray())
            .map(async q => ({
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
            path: `/upload/${file.filename}`
        };
        const res = await this.storage.collection('files').insertOne(f);
        f._id = res.insertedId.toHexString();
        return f;
    }

    async getUserByName(name: string): Promise<User<string>> {
        return await this.storage.collection('users').findOne({name});
    }
}
