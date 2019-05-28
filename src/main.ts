import { Cons, Empty } from "./core/List";
import { Student } from "./models/Student";
import { createTable } from "./core/Table";
import { And, StartsWith, EndsWith, Or, GreaterThen } from "./core/WhereOperators";
import { Func } from "./utils/Func";


//__TEST TABLE With dummy data__
let student1: Student = { id: 1, name: "George", surname: "Strait", age: 67, email: "info@georgestrait.com", Grades: Cons({ courseId: "SWE01", studentId: 1, grade: 7.4 }, Empty()) }
let student2: Student = { id: 2, name: "Brad", surname: "Paisley", age: 46, email: "info@bradpaisley.com", Grades: Cons({ courseId: "SWE01", studentId: 2, grade: 4.4 }, Empty()) }
let student3: Student = { id: 3, name: "Kane", surname: "Brown", age: 25, email: "info@kanebrown.com", Grades: Cons({ courseId: "SWE01", studentId: 3, grade: 8.7 }, Empty()) }
let student4: Student = { id: 4, name: "Luke", surname: "Bryan", age: 42, email: "info@lukebryan.com", Grades: Cons({ courseId: "SWE01", studentId: 4, grade: 9 }, Empty()) }
let student5: Student = { id: 5, name: "Keith", surname: "Urban", age: 51, email: "info@keithurban.com", Grades: Cons({ courseId: "SWE01", studentId: 5, grade: 5.5 }, Empty()) }
let student6: Student = { id: 6, name: "Blake", surname: "Shelton", age: 42, email: "info@blakeshelton.com", Grades: Cons({ courseId: "SWE01", studentId: 6, grade: 4 }, Empty()) }
let student7: Student = { id: 7, name: "Carie", surname: "Underwood", age: 36, email: "info@carie.com", Grades: Empty() }
let student8: Student = { id: 8, name: "Miranda", surname: "Lambert", age: 35, email: "info@lambert.com", Grades: Cons({ courseId: "SWE01", studentId: 8, grade: 10 }, Empty()) }
let student9: Student = { id: 9, name: "Ruud", surname: "Hermans", age: 60, email: "ruud.hermans@gmail.com", Grades: Empty() }

// Put all data in one List
let student_data = Cons(student1, Cons(student2, Cons(student3, Cons(student4,
    Cons(student5, Cons(student6, Cons(student7, Cons(student8, Cons(student9, Empty())))))))))



// Tables where the operation are on performed
let students = createTable(student_data)


/*
students.Select("name").Select("surname") or students.Select("name", "surname") is equivalent to the following SQL syntax: 
SELECT name, surname
FROM students
*/

let q1 = students.Select("name", "surname") // q1 and q2 have the same type
let q2 = students.Select("name").Select("surname")
let q3 = students.Select("name").Select("surname").Select("id").Select("age", "email") // Arguments of Select results in never[]

// console.log(q1.toList().toArray())
// console.log(q2.toList().toArray())
// console.log(q3.toList().toArray())


//-------------------------------------------------


/*
students.Select("name", "surname").Include("grades", q => q.Select("courseId", "grade")) is equivalent to the following SQL syntax: 
SELECT name, surname, courseId, grade
FROM students, grades
*/

let q4 = students.Select("name", "surname").Include("Grades", q => q.Select("grade", "studentId"))

// console.log(q4.toList().toArray())

// let prety_list = q4.toList().reduce<any[]>((arr, student) => arr.concat([{ ...student, Grades: student.Grades.toArray() }]), [])
// console.log(prety_list)


//-------------------------------------------------


/*
students.Select("name", "surname", "age").WHERE("surname", And(StartsWith("B"), EndsWith("n"))) is equivalent to the following SQL syntax: 
SELECT name, surname, age
FROM students
WHERE surname LIKE B% AND surname LIKE %n
*/

let q5 = students.Select("name", "surname", "age").Where("surname", And(StartsWith("B"), EndsWith("n")))
let q6 = students.Select("name", "surname", "age").Where("age", GreaterThen(25))
let q7 = students.Select("name").Select("surname").Include("Grades", q => q.Select("grade")).Where("Grades", Func(grades => {
    let sum = grades.reduce((s, x) => s + x.grade, 0)
    let avg = sum / grades.length
    return avg >= 5.5
}))

// console.log(q5.toList().toArray())
// console.log(q6.toList().toArray())
// console.log(q7.toList().toArray())


//-------------------------------------------------


/*
students.Select("surname", "age").OrderBy("age", "ASC") is equivalent to the following SQL syntax:
SELECT surname, age
FROM students
ORDER BY age ASC
*/

let q8 = students.Select("name", "surname", "age").OrderBy("age", "DESC")
let q9 = students.Select("name", "surname").OrderBy("name", "ASC")

// console.log(q8.toList().toArray())
// console.log(q9.toList().toArray())


//-------------------------------------------------


/*
students.Select("name").Include("Grades", q => q.Select("grade")).GroupBy(???) is equivalent to the following SQL syntax:
SELECT name, AVG(grade)
FROM students, grades
GROUP BY name
*/