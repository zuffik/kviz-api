import {
    GraphQLBoolean,
    GraphQLEnumType,
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
        subtitle: {
            type: GraphQLString,
            description: 'Subtitle of a quiz'
        },
        image: {
            type: uploadedFile,
            description: 'Cover image'
        },
        questions: {
            type: GraphQLList(question),
            description: 'Quiz questions'
        },
        replaces: {
            type: GraphQLList(replacedQuizzes),
            description: 'Quizzes replaced by current one'
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

export const image = new GraphQLObjectType({
    name: 'Image',
    fields: () => ({
        _id: {
            type: GraphQLNonNull(idType),
            description: 'Image ID'
        },
        path: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Path from root'
        },
        file: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name of file'
        },
    })
});

export const answerInput = new GraphQLInputObjectType({
    name: 'AnswerInput',
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

export const questionInput = new GraphQLInputObjectType({
    name: 'QuestionInput',
    description: 'Question for quiz',
    fields: () => ({
        _id: {
            type: idType,
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
            type: GraphQLList(answerInput),
            description: 'Possible answers'
        }
    })
});

export const quizInput = new GraphQLInputObjectType({
    name: 'QuizInput',
    fields: () => ({
        _id: {
            type: idType,
            description: 'Quiz ID'
        },
        title: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Title of a quiz'
        },
        subtitle: {
            type: GraphQLString,
            description: 'Subtitle of a quiz'
        },
        image: {
            type: uploadedFileInput,
            description: 'Cover image'
        },
        questions: {
            type: GraphQLList(questionInput),
            description: 'Quiz questions'
        },
        replaces: {
            type: GraphQLList(replacedQuizzesInput),
            description: 'Quizzes replaced by current one'
        }
    })
});

export const userInput = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
        _id: {
            type: idType,
            description: 'User ID'
        },
        name: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name of an quiz'
        },
    })
});

export const imageInput = new GraphQLInputObjectType({
    name: 'ImageInput',
    fields: () => ({
        _id: {
            type: idType,
            description: 'Image ID'
        },
        path: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Path from root'
        },
        file: {
            type: GraphQLNonNull(GraphQLString),
            description: 'Name of file'
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
        number: {value: 'number'},
    }
});

export const uploadedFile = new GraphQLObjectType({
    name: 'uploadedFile',
    fields: () => ({
        _id: {
            type: GraphQLNonNull(idType),
        },
        path: {
            type: GraphQLString
        },
        file: {
            type: GraphQLString
        }
    })
});

export const uploadedFileInput = new GraphQLInputObjectType({
    name: 'uploadedFileInput',
    fields: () => ({
        _id: {
            type: idType,
        },
        path: {
            type: GraphQLString
        },
        file: {
            type: GraphQLString
        }
    })
});

export const replacedQuizzes = new GraphQLObjectType({
    name: 'replacedQuizzes',
    fields: () => ({
        datetime: {type: GraphQLNonNull(GraphQLString), description: 'A time when was quiz replaced (updated)'},
        _id: {type: GraphQLNonNull(idType), description: 'What quiz was replaced'},
    })
});
export const replacedQuizzesInput = new GraphQLInputObjectType({
    name: 'replacedQuizzesInput',
    fields: () => ({
        datetime: {type: GraphQLNonNull(GraphQLString), description: 'A time when was quiz replaced (updated)'},
        _id: {type: GraphQLNonNull(idType), description: 'What quiz was replaced'},
    })
});
