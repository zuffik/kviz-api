import { Answer, Question, Quiz } from "../index";

export interface Storage {
    getQuizzes(): Quiz[];

    createQuiz(quiz: Quiz, questions: number[]): Quiz;

    createQuestion(question: Question, answers: number[]): Question;

    createAnswer(answer: Answer): Answer;
}
