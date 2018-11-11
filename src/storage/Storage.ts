import { Quiz } from "../index";

export interface Storage {
    getQuizzes(): Quiz[];
}
