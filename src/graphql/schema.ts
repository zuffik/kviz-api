import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { answer, question, quiz } from "./types";
import { createAnswer, createQuestion, createQuiz, quizQuery } from "./queries";

export const schema = new GraphQLSchema({
    types: [quiz, question, answer],
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            quizzes: quizQuery
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            createQuiz,
            createQuestion,
            createAnswer
        })
    })
});
