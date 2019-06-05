import { Cons, Empty } from "./core/List";
import { Student } from "./models/Student";
import { createTable } from "./core/Table";
import { And, StartsWith, EndsWith, Or, GreaterThen } from "./core/WhereOperators";
import { Func } from "./utils/Func";
import { createLazyTable, createData } from "./core/LazyTable";


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

// Lazy data is a Pair of List of Student and List of Unit, two equal length lists
let lazy_data = createData(student_data) 

// A LazyTable which only returns a chain of composable functions to execute
let lazy_students = createLazyTable<Student>()



//__SELECT__

/*
students.Select("name").Select("surname") or students.Select("name", "surname") is equivalent to the following SQL syntax: 
SELECT name, surname
FROM students
*/

let query1 = students.Select("name", "surname") // q1 and q2 have the same type
let query2 = students.Select("name").Select("surname")
let query3 = students.Select("name").Select("surname").Select("id").Select("age", "email", "Grades") // Arguments of the next Select results in never[]

let lazy_query1 = lazy_students.Select("name", "surname")
let lazy_query2 = lazy_students.Select("name").Select("surname")
let lazy_query3 = lazy_students.Select("name").Select("surname").Select("id").Select("age", "email", "Grades")


//-------------------------------------------------


//__INCLUDE__

/*
students.Select("name", "surname").Include("grades", q => q.Select("courseId", "grade")) is equivalent to the following SQL syntax: 
SELECT name, surname, courseId, grade
FROM students, grades
*/

let query4 = students.Select("name", "surname").Include("Grades", q => q.Select("grade", "studentId"))

let lazy_query4 = lazy_students.Select("name", "surname").Include("Grades", q => q.Select("grade", "studentId"))



//-------------------------------------------------


//__WHERE__

/*
students.Select("name", "surname", "age").WHERE("surname", And(StartsWith("B"), EndsWith("n"))) is equivalent to the following SQL syntax: 
SELECT name, surname, age
FROM students
WHERE surname LIKE B% AND surname LIKE %n
*/

let query5 = students.Select("name", "surname", "age").Where("surname", And(StartsWith("B"), EndsWith("n")))
let query6 = students.Select("name", "surname", "age").Where("age", GreaterThen(25))
let query7 = students.Select("name").Select("surname").Include("Grades", q => q.Select("grade")).Where("Grades", Func(grades => {
    let sum = grades.reduce((s, x) => s + x.grade, 0)
    let avg = sum / grades.length
    return avg >= 5.5
}))

let lazy_query5 = lazy_students.Select("name", "surname", "age").Where("surname", And(StartsWith("B"), EndsWith("n")))
let lazy_query6 = lazy_students.Select("name", "surname", "age").Where("age", GreaterThen(25))
let lazy_query7 = lazy_students.Select("name").Select("surname").Include("Grades", q => q.Select("grade")).Where("Grades", Func(grades => {
    let sum = grades.reduce((s, x) => s + x.grade, 0)
    let avg = sum / grades.length
    return avg >= 5.5
}))


//-------------------------------------------------


//__ORDER BY__

/*
students.Select("surname", "age").OrderBy("age", "ASC") is equivalent to the following SQL syntax:
SELECT surname, age
FROM students
ORDER BY age ASC
*/

let query8 = students.Select("name", "surname", "age").OrderBy("age", "DESC")
let query9 = students.Select("name", "surname").OrderBy("name", "ASC")

let lazy_query8 = lazy_students.Select("name", "surname", "age").OrderBy("age", "DESC")
let lazy_query9 = lazy_students.Select("name", "surname").OrderBy("name", "ASC")


//-------------------------------------------------


//__GROUP BY__

/*
students.Select("name").Include("Grades", q => q.Select("grade")).GroupBy(???) is equivalent to the following SQL syntax:
SELECT name, AVG(grade)
FROM students, grades
GROUP BY name
*/

let query10 = null! //TODO


// __Print result of the queries__

//SELECT
// console.log(query1.toList().toArray())
// console.log(query2.toList().toArray())
// console.log(query3.toList().toArray())

// INCLUDE
// console.log(query4.toList().toArray())

// WHERE
// console.log(query5.toList().toArray())
// console.log(query6.toList().toArray())
// console.log(query7.toList().toArray())

// ORDER BY
// console.log(query8.toList().toArray())
// console.log(query9.toList().toArray())


// __Execute the lazy queries, by applying the lazy_data to the query__

// SELECT
// console.log(lazy_query1.apply(lazy_data).toList().toArray())
// console.log(lazy_query2.apply(lazy_data).toList().toArray())
// console.log(lazy_query3.apply(lazy_data).toList().toArray())

// INCLUDE throws a runtime exception
console.log(lazy_query4.apply(lazy_data).toList().toArray())

// WHERE
// console.log(lazy_query5.apply(lazy_data).toList().toArray())
// console.log(lazy_query6.apply(lazy_data).toList().toArray())
// console.log(lazy_query7.apply(lazy_data).toList().toArray())

// ORDER BY
// console.log(lazy_query8.apply(lazy_data).toList().toArray())
// console.log(lazy_query9.apply(lazy_data).toList().toArray())



