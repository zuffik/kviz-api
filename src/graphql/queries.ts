import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { answer, question, questionAnswerPair, quiz, user, userAnsweredQuiz } from "./types";
import { Answer, User } from "../index";
import { Storage } from "../storage/Storage";
import * as _ from "lodash";
const idType = _.includes(['MongoDB'], process.env.STORAGE) ? GraphQLString : GraphQLInt;

export const quizQuery = {
    type: GraphQLList(quiz),
    args: {},
    resolve: async (root: any, {}) => (await Storage.instance()).getQuizzes()
};

export const usersQuery = {
    type: GraphQLList(user),
    args: {},
    resolve: async (root: any, {}) => (await Storage.instance()).getUsers()
};

export const userAnswersQuery = {
    type: GraphQLList(userAnsweredQuiz),
    args: {
        id: {type: idType}
    },
    resolve: async (root: any, a: { user?: number }) => (await Storage.instance()).getUserAnswers(a.user)
};

export const createQuiz = {
    type: quiz,
    description: 'Creates a quiz',
    args: {
        title: {type: GraphQLString},
        questions: {type: GraphQLList(idType)},
    },
    resolve: async (val: any, q: any) => (await Storage.instance()).createQuiz({
        title: q.title as string,
        questions: []
    }, q.questions)
};

export const createQuestion = {
    type: question,
    description: 'Creates a question',
    args: {
        text: {type: GraphQLString},
        answers: {type: GraphQLList(idType)},
    },
    resolve: async (val: any, q: any) => (await Storage.instance()).createQuestion({
        text: q.text as string,
        answers: []
    }, q.answers)
};

export const createAnswer = {
    type: answer,
    description: 'Creates a answer',
    args: {
        text: {type: GraphQLString},
        isCorrect: {type: GraphQLBoolean},
    },
    resolve: async (val: any, answer: Answer) => (await Storage.instance()).createAnswer(answer)
};

export const createUser = {
    type: user,
    description: 'Creates an user',
    args: {
        name: {type: GraphQLString},
    },
    resolve: async (val: any, user: User) => (await Storage.instance()).createUser(user)
};

export const answerQuestion = {
    type: userAnsweredQuiz,
    description: 'Creates an user answer to question',
    args: {
        user: {type: idType},
        quiz: {type: idType},
        answers: {type: GraphQLList(questionAnswerPair), description: 'List of answered questions'},
    },
    resolve: async (val: any, a: { user: number, quiz: number, answers: { question: number, answer: number }[] }) =>
        (await Storage.instance()).createUserAnswers(a.user, a.quiz, a.answers)
};
