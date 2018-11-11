import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { MockStorage } from "../storage/MockStorage";
import { Storage } from "../storage/Storage";
import { answer, question, quiz } from "./types";
import { Answer, Question, Quiz } from "../index";

const storage: Storage = new MockStorage();

export const quizQuery = {
    type: GraphQLList(quiz),
    args: {},
    resolve: (root: any, {}) => storage.getQuizzes()
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
