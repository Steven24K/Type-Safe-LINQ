import { Student } from "../models/Student";
import { Grade } from "../models/Grade";

export interface Context {
    Students: Student
    Grades: Grade
}
