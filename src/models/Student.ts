import { Grade } from "./Grade";
import { List } from "../core/List";

export interface Student {
    id: number,
    name: string
    surname: string
    age: number
    email: string
    Grades: List<Grade>
}

