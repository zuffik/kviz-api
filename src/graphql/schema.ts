import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { answer, question, quiz } from "./types";
import { quizQuery } from "./queries";

export const schema = new GraphQLSchema({
    types: [quiz, question, answer],
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            products: quizQuery
        })
    })
});
