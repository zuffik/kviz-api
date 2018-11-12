import {
    GraphQLBoolean, GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLType
} from "graphql";
import { Answer } from "../index";

export const answer = new GraphQLObjectType({
    name: 'Answer',
    description: 'An answer to a question',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
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
        id: {
            type: GraphQLNonNull(GraphQLInt),
            description: 'Question ID'
        },
        text: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Text of an question'
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
        id: {
            type: GraphQLNonNull(GraphQLInt),
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
        id: {
            type: GraphQLNonNull(GraphQLInt),
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
            type: GraphQLNonNull(GraphQLInt),
            description: 'Question ID'
        },
        answer: {
            type: GraphQLNonNull(GraphQLInt),
            description: 'Answer ID'
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
        }
    })
});

export const userAnsweredQuiz = new GraphQLObjectType({
    name: 'UserAnsweredQuiz',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
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
