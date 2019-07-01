import { List, Empty, Cons } from "../core/List";
import { Student } from "../models/Student";
import { Course } from "../models/Course";

const getRandomFloat = (min: number, max: number): number => {
    min = min;
    max = max;
    return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
}

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(getRandomFloat(min, max)); //The maximum is exclusive and the minimum is inclusive
}



const generateCourses = (amount: number): List<Course> => {
    let coursenames = [
        'Software Engineering', 'Development 1', 'Development 2', 'Development 3', 'Development 4', 'Development 5', 'Development 6a', 'Development 6b',
        'Development 7', 'Development 8', 'SLC', 'Skils', 'Analysis 1', 'Analysis 2' ,'Analysis 3', 'Analysis 4', 'Analysis 5', 'Analysis 6', 'Analysis 7', 
        'Analysis 8', 'English', 'Nederlands', 'Acting', 'Theatre monologues', 'Spokenword', 'Project 7/8'
    ]

    let courses = Empty<Course>()
    for (var i = 0; i <= getRandomInt(0, 15); i++) {
        courses = Cons(
            Course(
                coursenames[getRandomInt(0, coursenames.length -1)], 
                getRandomFloat(1, 10), 
                getRandomInt(1, 30)
            ),
            courses
        )
    }

    return courses
}

export const DataGenerator = (length: number): List<Student> => {
    let result = Empty<Student>()
    let names = ['Steven', 'Bob', 'Ellen', 'Blake', 'Johny', 'Keith', 'Brett', 'Brad', 'Carie', 'Chris', 'Miranda', 'Kane']
    let surnames = ['Degeneres', 'Doest', 'Koerts', 'Shelton', 'Cash', 'Eldredge', 'Paisley', 'Young', 'Metz', 'Underwood', 'Lambert', 'Pitt', 'Brown', 'Depp', 'Jansen', 'van Vliet', 'Williams']
    let gender: Array<'male' | 'female'> = ['male', 'female']


    for (var i = 0; i <= length; i++) {
        result = Cons(
            Student(
                names[getRandomInt(0, names.length-1)],
                surnames[getRandomInt(0, surnames.length-1)],
                getRandomInt(0, 100),
                gender[getRandomInt(0, gender.length-1)],
                generateCourses(getRandomInt(0, 15))
            ),
            result
        )
    }

    return result
}