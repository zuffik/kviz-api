export interface Answer {
    id?: number;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id?: number;
    text: string;
    answers: Answer[];
}

export interface Quiz {
    id?: number;
    title: string;
    questions: Question[];
}

export interface User {
    id?: number;
    name: string;
}

export interface UserAnsweredQuestion {
    question: Question;
    answers: Answer[];
}

export interface UserAnsweredQuiz {
    id?: number;
    user: User;
    quiz: Quiz;
    questions: UserAnsweredQuestion[];
}
