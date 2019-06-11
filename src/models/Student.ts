import { Course } from "./Course";
import { List } from "../core/List";

export interface Student {
    name: string
    surname: string
    age: number
    gender: "male" | "female"
    Courses: List<Course>
}

export const Student = (
    name: string,
    surname: string,
    age: number,
    gender: "male" | "female",
    courses: List<Course>
): Student => ({
    name: name,
    surname: surname,
    age: age,
    gender: gender,
    Courses: courses
})