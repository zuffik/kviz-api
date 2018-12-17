import { GraphQLObjectType, GraphQLSchema } from "graphql";
import {
    answer, answerInput, image, imageInput,
    question,
    questionAnswerPair, questionInput,
    questionTextAnswerPair,
    QuestionType,
    quiz, quizInput, replacedQuizzesInput,
    uploadedFile, uploadedFileInput,
    user,
    userAnsweredQuestion,
    userAnsweredQuiz, userInput
} from "./types";
import {
    answerQuestion,
    createAnswer,
    createQuestion,
    createQuiz, createQuizFromObject,
    createUser,
    editQuiz, imagesQuery,
    quizQuery,
    userAnswersQuery,
    usersQuery
} from "./queries";

export const schema = new GraphQLSchema({
    types: [
        quiz,
        answerInput,
        questionInput,
        quizInput,
        userInput,
        imageInput,
        uploadedFileInput,
        replacedQuizzesInput,
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
            createQuizFromObject,
            editQuiz,
            createQuestion,
            createAnswer,
            createUser,
            answerQuestion
        })
    })
});
