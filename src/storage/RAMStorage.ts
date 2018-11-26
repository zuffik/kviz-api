import { IStorage } from "./Storage";
import { Answer, Question, Quiz, UploadedFile, User, UserAnsweredQuestion, UserAnsweredQuiz } from "../index";
import * as _ from 'lodash';

export class RAMStorage implements IStorage {
    quizzes: Quiz[] = [];
    questions: Question[] = [];
    answers: Answer[] = [];
    users: User[] = [];
    answeredQuizzes: UserAnsweredQuiz[] = [];
    files: Express.Multer.File[] = [];

    async getQuizzes(): Promise<Quiz[]> {
        return this.quizzes;
    }

    async createQuiz(quiz: Quiz, questions: number[]): Promise<Quiz> {
        quiz._id = this.quizzes.length > 0 ? (this.quizzes[this.quizzes.length - 1]._id || 0) + 1 : 1;
        quiz.questions = [...this.questions].filter(a => _.includes(questions, a._id));
        this.quizzes.push(quiz);
        return quiz;
    }

    async createAnswer(answer: Answer): Promise<Answer> {
        answer._id = this.answers.length > 0 ? (this.answers[this.answers.length - 1]._id || 0) + 1 : 1;
        this.answers.push(answer);
        return answer;
    }

    async createQuestion(question: Question, answers: number[]): Promise<Question> {
        question._id = this.questions.length > 0 ? (this.questions[this.questions.length - 1]._id || 0) + 1 : 1;
        question.answers = [...this.answers].filter(a => _.includes(answers, a._id));
        this.questions.push(question);
        return question;
    }

    async createUser(user: User): Promise<User> {
        user._id = this.users.length > 0 ? (this.users[this.users.length - 1]._id || 0) + 1 : 1;
        this.users.push(user);
        return user;
    }

    async createUserAnswers(
        user: number,
        quiz: number,
        answers: { question: number, answer: number }[],
        textAnswers: { question: number, answer: string }[]
    ):
        Promise<UserAnsweredQuiz> {
        const q: Quiz = _.find(this.quizzes, ['id', quiz]) || {_id: 0, questions: [], title: '', replaces: {}};
        const u = _.find(this.users, ['id', user]) || {_id: 0, name: ''};
        const id = this.answeredQuizzes.length > 0 ?
            (this.answeredQuizzes[this.answeredQuizzes.length - 1]._id || 0) + 1 : 1;
        const questions: UserAnsweredQuestion[] = answers.map(k => ({
            question: _.find(this.questions, ['id', k.question]) ||
                {_id: 0, text: '', answers: [], type: 'radio', hasOtherAnswer: false},
            answers: [...this.answers].filter(a => a._id === k.answer),
            text: _.get(_.find(textAnswers, {question: k.question}), ['answer'], '')
        }));
        const ans = {
            id,
            quiz: q,
            user: u,
            questions
        };
        this.answeredQuizzes.push(ans);
        return ans;
    }

    async getUserAnswers(user?: number): Promise<UserAnsweredQuiz[]> {
        let result = this.answeredQuizzes;
        if (user) {
            result = result.filter(q => q.user._id === user);
        }
        return result;
    }

    async getUsers(): Promise<User[]> {
        return this.users;
    }

    async init(): Promise<void> {
        return;
    }

    async saveFile(file: Express.Multer.File): Promise<UploadedFile<number>> {
        this.files.push(file);
        return {
            file: file.filename,
            path: `/upload/${file.filename}`,
            _id: this.files.length
        };
    }

    async getUserByName(name: string): Promise<User<number>> {
        return _.find(this.users, ['name', name]) as User<number>;
    }
}
