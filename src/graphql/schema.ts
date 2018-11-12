import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { answer, question, questionAnswerPair, quiz, user, userAnsweredQuestion, userAnsweredQuiz } from "./types";
import {
    answerQuestion,
    createAnswer,
    createQuestion,
    createQuiz,
    createUser,
    quizQuery,
    userAnswersQuery,
    usersQuery
} from "./queries";

export const schema = new GraphQLSchema({
    types: [quiz, question, answer, user, questionAnswerPair, userAnsweredQuestion, userAnsweredQuiz],
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            quizzes: quizQuery,
            users: usersQuery,
            userAnswers: userAnswersQuery
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            createQuiz,
            createQuestion,
            createAnswer,
            createUser,
            answerQuestion
        })
    })
});
