import { GraphQLList } from "graphql";
import { MockStorage } from "../storage/MockStorage";
import { Storage } from "../storage/Storage";
import { quiz } from "./types";

const storage: Storage = new MockStorage();

export const quizQuery = {
    type: GraphQLList(quiz),
    args: {},
    resolve: (root: any, {}) => storage.getQuizzes()
};
