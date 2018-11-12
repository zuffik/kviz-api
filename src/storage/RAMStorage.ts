import { IStorage } from "./Storage";
import { Answer, Question, Quiz, User, UserAnsweredQuestion, UserAnsweredQuiz } from "../index";
import * as _ from 'lodash';

export class RAMStorage implements IStorage {
    quizzes: Quiz[] = [];
    questions: Question[] = [];
    answers: Answer[] = [];
    users: User[] = [];
    answeredQuizzes: UserAnsweredQuiz[] = [];

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

    createUser(user: User): User {
        user.id = this.users.length > 0 ? this.users[this.users.length - 1].id + 1 : 1;
        this.users.push(user);
        return user;
    }

    createUserAnswers(user: number, quiz: number, answers: { question: number, answer: number }[]): UserAnsweredQuiz {
        const q = _.find(this.quizzes, ['id', quiz]);
        const u = _.find(this.users, ['id', user]);
        const id = this.answeredQuizzes.length > 0 ? this.answeredQuizzes[this.answeredQuizzes.length - 1].id + 1 : 1;
        const questions: UserAnsweredQuestion[] = answers.map(k => ({
            question: _.find(this.questions, ['id', k.question]),
            answers: [...this.answers].filter(a => a.id === k.answer)
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

    getUserAnswers(user?: number): UserAnsweredQuiz[] {
        let result = this.answeredQuizzes;
        console.log(JSON.stringify(result));
        if (user) {
            result = result.filter(q => q.user.id === user);
        }
        return result;
    }

    getUsers(): User[] {
        return this.users;
    }
}
