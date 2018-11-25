import {
    GraphQLBoolean, GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from "graphql";
import { Answer } from "../index";
import * as _ from 'lodash';
const idType = _.includes(['MongoDB'], process.env.STORAGE) ? GraphQLString : GraphQLInt;

export const answer = new GraphQLObjectType({
    name: 'Answer',
    description: 'An answer to a question',
    fields: () => ({
        _id: {
            type: GraphQLNonNull(idType),
            description: 'Answer ID'
        },
        text: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Text of an answer'
        },
        isCorrect: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Whether an answer is correct'
        }
    })
});

export const question = new GraphQLObjectType({
    name: 'Question',
    description: 'Question for quiz',
    fields: () => ({
        _id: {
            type: GraphQLNonNull(idType),
            description: 'Question ID'
        },
        text: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Text of an question'
        },
        type: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Type of an question'
        },
        hasOtherAnswer: {
            type: GraphQLNonNull(GraphQLBoolean),
            description: 'Whether has "other" input'
        },
        answers: {
            type: GraphQLList(answer),
            description: 'Possible answers'
        }
    })
});

export const quiz = new GraphQLObjectType({
    name: 'Quiz',
    fields: () => ({
        _id: {
            type: GraphQLNonNull(idType),
            description: 'Quiz ID'
        },
        title: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Title of a quiz'
        },
        questions: {
            type: GraphQLList(question),
            description: 'Quiz questions'
        }
    })
});

export const user = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: {
            type: GraphQLNonNull(idType),
            description: 'User ID'
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name of an quiz'
        },
    })
});

export const questionAnswerPair = new GraphQLInputObjectType({
    name: 'QuestionAnswerPair',
    fields: () => ({
        question: {
            type: GraphQLNonNull(idType),
            description: 'Question ID'
        },
        answer: {
            type: GraphQLNonNull(idType),
            description: 'Answer ID'
        },
    })
});

export const questionTextAnswerPair = new GraphQLInputObjectType({
    name: 'QuestionTextAnswerPair',
    fields: () => ({
        question: {
            type: GraphQLNonNull(idType),
            description: 'Question ID'
        },
        answer: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Answer'
        },
    })
});

export const userAnsweredQuestion = new GraphQLObjectType({
    name: 'UserAnsweredQuestion',
    fields: () => ({
        question: {
            type: question,
        },
        answers: {
            type: GraphQLList(answer)
        },
        text: {
            type: GraphQLString
        }
    })
});

export const userAnsweredQuiz = new GraphQLObjectType({
    name: 'UserAnsweredQuiz',
    fields: () => ({
        _id: {
            type: GraphQLNonNull(idType),
        },
        user: {
            type: user,
        },
        quiz: {
            type: quiz,
        },
        questions: {
            type: GraphQLList(userAnsweredQuestion),
        },
    })
});

export const QuestionType = new GraphQLEnumType({
    name: 'QuestionType',
    values: {
        text: {value: 'text'},
        radio: {value: 'radio'},
        checkbox: {value: 'checkbox'},
    }
});
