import { Answer, Question, Quiz, UniqueId, UploadedFile, User, UserAnsweredQuiz, UniqueIdType as UniqueIdTypeEnum } from "../index";
import { RAMStorage } from "./RAMStorage";
import { MongoDBStorage } from "./MongoDBStorage";

const storages: { [key: string]: IStorage<UniqueId> } = {
    RAM: new RAMStorage(),
    MongoDB: new MongoDBStorage()
};

export interface IStorage<UniqueIdType extends UniqueId = number> {
    init(): Promise<void>;

    getQuizzes(): Promise<Quiz<UniqueIdType>[]>;

    createQuiz(quiz: Quiz<UniqueIdType>, questions: UniqueIdType[]): Promise<Quiz<UniqueIdType>>;

    createQuestion(question: Question<UniqueIdType>, answers: UniqueIdType[]): Promise<Question<UniqueIdType>>;

    createAnswer(answer: Answer<UniqueIdType>): Promise<Answer<UniqueIdType>>;

    createUser(user: User<UniqueIdType>): Promise<User<UniqueIdType>>;

    createUserAnswers(
        user: UniqueIdType,
        quiz: UniqueIdType,
        answers: { question: UniqueIdType, answer: UniqueIdType }[],
        textAnswers: { question: UniqueIdType, answer: string }[]
    ): Promise<UserAnsweredQuiz<UniqueIdType>>;

    getUsers(): Promise<User<UniqueIdType>[]>;

    getUserAnswers(user?: UniqueIdType): Promise<UserAnsweredQuiz<UniqueIdType>[]>;

    saveFile(file: Express.Multer.File): Promise<UploadedFile<UniqueIdType>>;

    getUserByName(name: string): Promise<User<UniqueIdType> | undefined>;
}

export class Storage {
    private static inst: IStorage<UniqueId>;

    private constructor() {
    }

    public static instance(): Promise<IStorage<UniqueId>> {
        if (this.inst === undefined) {
            this.inst = storages[process.env.STORAGE || 'RAM'];
            MongoDBStorage.url = process.env.MONGODB_CONNECT_STRING || '';
            return new Promise(res => this.inst.init().then(() => res(this.inst)));
        }
        return new Promise<IStorage<UniqueId>>(r => r(this.inst));
    }
}
