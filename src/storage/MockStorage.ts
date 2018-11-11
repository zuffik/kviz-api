import { Storage } from "./Storage";
import { Answer, Question, Quiz } from "../index";
import * as _ from 'lodash';

export class MockStorage implements Storage {
    quizzes: Quiz[] = [];
    questions: Question[] = [];
    answers: Answer[] = [];

    getQuizzes(): Quiz[] {
        return this.quizzes;
    }

    createQuiz(quiz: Quiz, questions: number[]): Quiz {
        quiz.id = this.quizzes.length > 0 ? this.quizzes[this.quizzes.length - 1].id + 1 : 1;
        quiz.questions = [...this.questions].filter(a => _.includes(questions, a.id));
        this.quizzes.push(quiz);
        return quiz;
    }

    createAnswer(answer: Answer): Answer {
        answer.id = this.answers.length > 0 ? this.answers[this.answers.length - 1].id + 1 : 1;
        this.answers.push(answer);
        return answer;
    }

    createQuestion(question: Question, answers: number[]): Question {
        question.id = this.questions.length > 0 ? this.questions[this.questions.length - 1].id + 1 : 1;
        question.answers = [...this.answers].filter(a => _.includes(answers, a.id));
        this.questions.push(question);
        return question;
    }
}
