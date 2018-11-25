import { GraphQLBoolean, GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import {
    answer,
    question,
    questionAnswerPair,
    questionTextAnswerPair,
    QuestionType,
    quiz,
    user,
    userAnsweredQuiz
} from "./types";
import { Answer, UniqueId, User } from "../index";
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
    resolve: async (root: any, a: { user?: UniqueId }) => (await Storage.instance()).getUserAnswers(a.user)
};

export const createQuiz = {
    type: quiz,
    description: 'Creates a quiz',
    args: {
        title: {type: GraphQLString, description: 'Quiz title'},
        questions: {type: GraphQLList(idType), description: 'List of question ids'},
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
        text: {type: GraphQLString, description: 'Question text'},
        answers: {type: GraphQLList(idType), description: 'List of answer ids (in case of checkbox or radio type)'},
        type: {type: GraphQLNonNull(QuestionType), description: 'Either text, radio or checkbox'},
        hasOtherAnswer: {type: GraphQLBoolean, description: 'Whether has other text field'},
    },
    resolve: async (val: any, q: any) => (await Storage.instance()).createQuestion({
        text: q.text as string,
        answers: [],
        type: q.type as 'radio' | 'checkbox' | 'text',
        hasOtherAnswer: !!q.hasOtherAnswer
    }, q.answers)
};

export const createAnswer = {
    type: answer,
    description: 'Creates a answer',
    args: {
        text: {type: GraphQLString, description: 'Answer text'},
        isCorrect: {type: GraphQLBoolean, description: 'Whether answer is correct'},
    },
    resolve: async (val: any, answer: Answer) => (await Storage.instance()).createAnswer(answer)
};

export const createUser = {
    type: user,
    description: 'Creates an user',
    args: {
        name: {type: GraphQLString, description: 'User name'},
    },
    resolve: async (val: any, user: User) => (await Storage.instance()).createUser(user)
};

export const answerQuestion = {
    type: userAnsweredQuiz,
    description: 'Creates an user answer to question',
    args: {
        user: {type: GraphQLNonNull(idType), description: 'User ID'},
        quiz: {type: GraphQLNonNull(idType), description: 'Quiz ID'},
        answers: {type: GraphQLList(questionAnswerPair), description: 'List of answered questions'},
        textAnswers: {type: GraphQLList(questionTextAnswerPair), description: 'List of answered questions'},
    },
    resolve: async (val: any, a: {
        user: UniqueId,
        quiz: UniqueId,
        answers: { question: UniqueId, answer: UniqueId }[],
        textAnswers: { question: UniqueId, answer: string }[]
    }) =>
        (await Storage.instance()).createUserAnswers(a.user, a.quiz, a.answers, a.textAnswers)
};
