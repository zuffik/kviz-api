import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
    answer, image,
    question,
    questionAnswerPair,
    questionTextAnswerPair,
    QuestionType,
    quiz,
    uploadedFile,
    user,
    userAnsweredQuestion,
    userAnsweredQuiz
} from "./types";
import {
    answerQuestion,
    createAnswer,
    createQuestion,
    createQuiz,
    createUser,
    editQuiz, imagesQuery,
    quizQuery,
    userAnswersQuery,
    usersQuery
} from "./queries";

export const schema = new GraphQLSchema({
    types: [
        quiz,
        question,
        answer,
        user,
        questionAnswerPair,
        userAnsweredQuestion,
        userAnsweredQuiz,
        questionTextAnswerPair,
        QuestionType,
        uploadedFile,
        image
    ],
    query: new GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            quizzes: quizQuery,
            users: usersQuery,
            userAnswers: userAnswersQuery,
            images: imagesQuery
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: () => ({
            createQuiz,
            editQuiz,
            createQuestion,
            createAnswer,
            createUser,
            answerQuestion
        })
    })
});
