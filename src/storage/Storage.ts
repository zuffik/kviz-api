import { Answer, Question, Quiz, User, UserAnsweredQuiz } from "../index";
import { RAMStorage } from "./RAMStorage";

const storages: {[key: string]: IStorage} = {
    RAM: new RAMStorage(),
};

export interface IStorage {
    getQuizzes(): Quiz[];

    createQuiz(quiz: Quiz, questions: number[]): Quiz;

    createQuestion(question: Question, answers: number[]): Question;

    createAnswer(answer: Answer): Answer;

    createUser(user: User): User;

    createUserAnswers(user: number, quiz: number, answers: { question: number, answer: number }[]): UserAnsweredQuiz;

    getUsers(): User[];

    getUserAnswers(user?: number): UserAnsweredQuiz[];
}

export class Storage {
    private static inst: IStorage;

    private constructor() {
    }

    public static instance(): IStorage {
        if (this.inst === undefined) {
            this.inst = storages[process.env.STORAGE || 'RAM'];
        }
        return this.inst;
    }
}
