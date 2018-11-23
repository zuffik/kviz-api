import { IStorage } from "./Storage";
import { Answer, Question, Quiz, User, UserAnsweredQuestion, UserAnsweredQuiz } from "../index";
import * as _ from 'lodash';

export class RAMStorage implements IStorage {
    quizzes: Quiz[] = [];
    questions: Question[] = [];
    answers: Answer[] = [];
    users: User[] = [];
    answeredQuizzes: UserAnsweredQuiz[] = [];

    async getQuizzes(): Promise<Quiz[]> {
        return this.quizzes;
    }

    async createQuiz(quiz: Quiz, questions: number[]): Promise<Quiz> {
        quiz._id = this.quizzes.length > 0 ? this.quizzes[this.quizzes.length - 1]._id + 1 : 1;
        quiz.questions = [...this.questions].filter(a => _.includes(questions, a._id));
        this.quizzes.push(quiz);
        return quiz;
    }

    async createAnswer(answer: Answer): Promise<Answer> {
        answer._id = this.answers.length > 0 ? this.answers[this.answers.length - 1]._id + 1 : 1;
        this.answers.push(answer);
        return answer;
    }

    async createQuestion(question: Question, answers: number[]): Promise<Question> {
        question._id = this.questions.length > 0 ? this.questions[this.questions.length - 1]._id + 1 : 1;
        question.answers = [...this.answers].filter(a => _.includes(answers, a._id));
        this.questions.push(question);
        return question;
    }

    async createUser(user: User): Promise<User> {
        user._id = this.users.length > 0 ? this.users[this.users.length - 1]._id + 1 : 1;
        this.users.push(user);
        return user;
    }

    async createUserAnswers(user: number, quiz: number, answers: { question: number, answer: number }[]):
        Promise<UserAnsweredQuiz> {
        const q = _.find(this.quizzes, ['id', quiz]);
        const u = _.find(this.users, ['id', user]);
        const id = this.answeredQuizzes.length > 0 ? this.answeredQuizzes[this.answeredQuizzes.length - 1]._id + 1 : 1;
        const questions: UserAnsweredQuestion[] = answers.map(k => ({
            question: _.find(this.questions, ['id', k.question]),
            answers: [...this.answers].filter(a => a._id === k.answer)
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
}
