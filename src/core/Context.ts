import { Student } from "../models/Student";
import { Grade } from "../models/Grade";

export interface Context {
    Student: Student
    Grade: Grade
}