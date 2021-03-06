import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import {
    answer, image,
    question,
    questionAnswerPair,
    questionTextAnswerPair,
    QuestionType,
    quiz, quizInput,
    user,
    userAnsweredQuiz
} from "./types";
import { Answer, Quiz, UniqueId, User } from "../index";
import { Storage } from "../storage/Storage";
import * as _ from "lodash";
import * as moment from 'moment';

const idType = _.includes(['MongoDB'], process.env.STORAGE) ? GraphQLString : GraphQLInt;

export const quizQuery = {
    type: GraphQLList(quiz),
    args: {
        _id: {type: idType, description: 'Quiz ID'}
    },
    resolve: async (root: any, a: { _id?: UniqueId }) => (await (await Storage.instance()).getQuizzes(a)).map(q => ({
        ...q,
        replaces: _.toPairs(q.replaces).map(value => ({
            datetime: moment(parseInt(value[0], 10)).format(),
            _id: value[1]
        }))
    }))
};

export const usersQuery = {
    type: GraphQLList(user),
    args: {
        _id: {type: idType, description: 'User ID'}
    },
    resolve: async (root: any, a: { _id?: UniqueId }) => (await Storage.instance()).getUsers(a)
};

export const imagesQuery = {
    type: GraphQLList(image),
    resolve: async (root: any, a: {}) => (await Storage.instance()).getImages()
};

export const userAnswersQuery = {
    type: GraphQLList(userAnsweredQuiz),
    args: {
        _id: {type: idType, description: 'User ID'}
    },
    resolve: async (root: any, a: { _id?: UniqueId }) => (await Storage.instance()).getUserAnswers(a._id)
};

export const createQuiz = {
    type: quiz,
    description: 'Creates a quiz',
    args: {
        title: {type: GraphQLNonNull(GraphQLString), description: 'Quiz title'},
        slug: {type: GraphQLNonNull(GraphQLString), description: 'Quiz slug'},
        subtitle: {type: GraphQLString, description: 'Quiz subtitle'},
        questions: {type: GraphQLList(idType), description: 'List of question ids'},
        image: {type: GraphQLString, description: 'Cover image for quiz'},
    },
    resolve: async (val: any, q: any) => (await Storage.instance()).createQuiz({
        title: q.title as string,
        slug: q.slug as string,
        subtitle: q.subtitle as string,
        image: q.image as string,
        questions: [],
        replaces: {},
        createdAt: +moment()
    }, q.questions)
};

export const deleteQuiz = {
    type: quiz,
    description: 'Deletes a quiz',
    args: {
        _id: {type: GraphQLString}
    },
    resolve: async (val: any, q: {_id: string}) => (await Storage.instance()).deleteQuiz(q._id)
};

export const createQuizFromObject = {
    type: quiz,
    description: 'Creates a quiz',
    args: {
        quiz: {type: quizInput, description: 'Quiz'}
    },
    resolve: async (val: any, q: {quiz: Quiz<string>}) => (await Storage.instance()).createQuiz(q.quiz)
};

export const editQuiz = {
    type: quiz,
    description: 'Updates a quiz',
    args: {
        _id: {type: GraphQLNonNull(idType), description: 'Quiz _id to be edited'},
        title: {type: GraphQLNonNull(GraphQLString), description: 'Quiz title'},
        slug: {type: GraphQLNonNull(GraphQLString), description: 'Quiz slug'},
        subtitle: {type: GraphQLString, description: 'Quiz subtitle'},
        questions: {type: GraphQLList(idType), description: 'List of question ids'},
        image: {type: GraphQLString, description: 'Cover image for quiz'},
    },
    resolve: async (val: any, q: any) => (await Storage.instance()).updateQuiz({
        _id: q._id as string,
        title: q.title as string,
        slug: q.slug as string,
        subtitle: q.subtitle as string,
        image: q.image as string,
        questions: [],
        replaces: {},
        createdAt: +moment()
    }, q.questions)
};

export const editQuizFromObject = {
    type: quiz,
    description: 'Updates a quiz',
    args: {
        quiz: {type: quizInput, description: 'Quiz'}
    },
    resolve: async (val: any, q: {quiz: Quiz<string>}) => (await Storage.instance()).updateQuiz(q.quiz)
};

export const createQuestion = {
    type: question,
    description: 'Creates a question',
    args: {
        text: {type: GraphQLNonNull(GraphQLString), description: 'Question text'},
        answers: {type: GraphQLList(idType), description: 'List of answer ids (in case of checkbox or radio type)'},
        type: {type: GraphQLNonNull(QuestionType), description: 'Either text, radio or checkbox'},
        hasOtherAnswer: {type: GraphQLBoolean, description: 'Whether has other text field'},
    },
    resolve: async (val: any, q: any) => (await Storage.instance()).createQuestion({
        text: q.text as string,
        answers: [],
        type: q.type as 'radio' | 'checkbox' | 'text',
        hasOtherAnswer: !!q.hasOtherAnswer,
        createdAt: +moment()
    }, q.answers)
};

export const createAnswer = {
    type: answer,
    description: 'Creates a answer',
    args: {
        text: {type: GraphQLString, description: 'Answer text'},
        isCorrect: {type: GraphQLBoolean, description: 'Whether answer is correct'},
    },
    resolve: async (val: any, answer: Answer) => (await Storage.instance()).createAnswer({
        ...answer,
        createdAt: +moment()
    })
};

export const createUser = {
    type: user,
    description: 'Creates an user',
    args: {
        name: {type: GraphQLString, description: 'User name'},
        password: {type: GraphQLString, description: 'User password'},
    },
    resolve: async (val: any, user: User) => (await Storage.instance()).createUser({
        ...user,
        createdAt: +moment()
    })
};

export const answerQuestion = {
    type: userAnsweredQuiz,
    description: 'Creates an user answer to question',
    args: {
        user: {type: idType, description: 'User ID'},
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
        (await Storage.instance()).createUserAnswers(a.quiz, a.answers, a.textAnswers, a.user)
};
