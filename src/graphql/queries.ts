import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { Storage } from "../storage/Storage";
import { answer, question, questionAnswerPair, quiz, user, userAnsweredQuiz } from "./types";
import { Answer, User } from "../index";

const storage = Storage.instance();

export const quizQuery = {
    type: GraphQLList(quiz),
    args: {},
    resolve: (root: any, {}) => storage.getQuizzes()
};

export const usersQuery = {
    type: GraphQLList(user),
    args: {},
    resolve: (root: any, {}) => storage.getUsers()
};

export const userAnswersQuery = {
    type: GraphQLList(userAnsweredQuiz),
    args: {
        id: {type: GraphQLInt}
    },
    resolve: (root: any, a: {user?: number}) => storage.getUserAnswers(a.user)
};

export const createQuiz = {
    type: quiz,
    description: 'Creates a quiz',
    args: {
        title: {type: GraphQLString},
        questions: {type: GraphQLList(GraphQLInt)},
    },
    resolve: (val: any, q: any) => storage.createQuiz({title: q.title as string, questions: []}, q.questions)
};

export const createQuestion = {
    type: question,
    description: 'Creates a question',
    args: {
        text: {type: GraphQLString},
        answers: {type: GraphQLList(GraphQLInt)},
    },
    resolve: (val: any, q: any) => storage.createQuestion({text: q.text as string, answers: []}, q.answers)
};

export const createAnswer = {
    type: answer,
    description: 'Creates a answer',
    args: {
        text: {type: GraphQLString},
        isCorrect: {type: GraphQLBoolean},
    },
    resolve: (val: any, answer: Answer) => storage.createAnswer(answer)
};

export const createUser = {
    type: user,
    description: 'Creates an user',
    args: {
        name: {type: GraphQLString},
    },
    resolve: (val: any, user: User) => storage.createUser(user)
};

export const answerQuestion = {
    type: userAnsweredQuiz,
    description: 'Creates an user answer to question',
    args: {
        user: {type: GraphQLInt},
        quiz: {type: GraphQLInt},
        answers: {type: GraphQLList(questionAnswerPair), description: 'List of answered questions'},
    },
    resolve: (val: any, a: {user: number, quiz: number, answers: { question: number, answer: number }[]}) =>
        storage.createUserAnswers(a.user, a.quiz, a.answers)
};
