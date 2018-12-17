export type UniqueId = string | number;

export type UniqueIdType = 'number' | 'string';

export interface Answer<UniqueIdType extends UniqueId = number> {
    _id?: UniqueIdType;
    createdAt: number;
    text: string;
    isCorrect: boolean;
}

export interface Question<UniqueIdType extends UniqueId = number> {
    _id?: UniqueIdType;
    createdAt: number;
    text: string;
    answers: Answer<UniqueIdType>[];
    type: 'radio' | 'checkbox' | 'text' | 'number';
    hasOtherAnswer: boolean;
}

export interface Quiz<UniqueIdType extends UniqueId = number> {
    _id?: UniqueIdType;
    createdAt: number;
    title: string;
    subtitle: string;
    image?: UploadedFile<UniqueIdType> | string;
    questions: Question<UniqueIdType>[];
    /** key should be timestamp with time of replacement */
    replaces: {[key: number]: UniqueIdType};
}

export interface User<UniqueIdType extends UniqueId = number> {
    _id?: UniqueIdType;
    createdAt: number;
    name: string;
    password?: string;
}

export interface UserAnsweredQuestion<UniqueIdType extends UniqueId = number> {
    question: Question<UniqueIdType>;
    answers?: Answer<UniqueIdType>[];
    text?: string;
}

export interface UserAnsweredQuiz<UniqueIdType extends UniqueId = number> {
    _id?: UniqueIdType;
    createdAt: number;
    user?: User;
    quiz: Quiz;
    questions: UserAnsweredQuestion<UniqueIdType>[];
}

export interface UploadedFile<UniqueIdType extends UniqueId = number> {
    _id?: UniqueIdType;
    createdAt: number;
    path: string;
    file: string;
}

