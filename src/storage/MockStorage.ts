import { Storage } from "./Storage";
import { Quiz } from "../index";

export class MockStorage implements Storage {
    getQuizzes(): Quiz[] {
        return [];
    }
}
