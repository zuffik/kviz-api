import {
    GraphQLBoolean,
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
