import { Cons, Empty, ListFromArray } from "./core/List";
import { Student } from "./models/Student";
import { createTable } from "./core/Table";
import { createLazyTable } from "./core/LazyTable";


//__TEST TABLE With dummy data__ put all data in one List
let student_data = ListFromArray([
    Student('George', 'Strait', 67, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 7.4 }, Empty())),
    Student('Brad', 'Paisley', 46, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 3.2 }, Empty())),
    Student('Kane', 'Brown', 25, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 1.5 }, Empty())),
    Student('Luke', 'Bryan', 25, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 5.4 }, Empty())),
    Student('Keith', 'Urban', 51, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 5.6 }, Empty())),
    Student('Blake', 'Shelton', 42, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 9 }, Empty())),
    Student('Carie', 'Underwood', 36, 'female', Cons({ name: "SWE01", studypoints: 30, grade: 8.2 }, Empty())),
    Student('Miranda', 'Lambert', 35, 'female', Cons({ name: "SWE01", studypoints: 30, grade: 4.4 }, Empty())),
    Student('Ruud', 'Hermans', 60, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 6.6 }, Empty())),
    Student('Johny', 'Cash', 71, 'male', Cons({ name: "SWE01", studypoints: 30, grade: 7.2 }, Empty())),
])

// Tables where the operation are on performed
let students = createTable(student_data)


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
let query3 = students.Select("name").Select("surname").Select("gender").Select("age", "Courses") // Arguments of the next Select results in never[]

let lazy_query1 = lazy_students.Select("name", "surname")
let lazy_query2 = lazy_students.Select("name").Select("surname")
let lazy_query3 = lazy_students.Select("name").Select("surname").Select("gender").Select("age", "Courses")


//-------------------------------------------------


//__INCLUDE__

/*
students.Select("name", "surname").Include("grades", q => q.Select("courseId", "grade")) is equivalent to the following SQL syntax: 
SELECT name, surname, courseId, grade
FROM students, grades
*/


let query4 = students.Select("name", "surname").Include("Courses", q => q.Select("grade", "studypoints"))

let lazy_query4 = lazy_students.Select("name", "surname").Include("Courses", q => q.Select("grade", "studypoints"))


//-------------------------------------------------


//__WHERE__

/*
students.Select("name", "surname", "age").WHERE("surname", And(StartsWith("B"), EndsWith("n"))) is equivalent to the following SQL syntax: 
SELECT name, surname, age
FROM students
WHERE surname LIKE B% AND surname LIKE %n
*/

let query5 = students.Select("name", "surname", "age").Where(f => f.get("surname").StartsWith("B").And(f => f.get("surname").EndsWith("n")))//.Where(f => Equals(f.get("surname"), f.get("name")))
let query6 = students.Select("name", "surname", "age").Where(f => f.get("age").GreaterThen(25))
let query7 = students.Select("name").Select("surname").Include("Courses", q => q.Select("grade").Where(f => f.get("grade").GreaterThen(5.5)))


let lazy_query5 = lazy_students.Select("name", "surname", "age").Where(f => f.get("surname").StartsWith("B").And(f => f.get("surname").EndsWith("n")))
let lazy_query6 = lazy_students.Select("name", "surname", "age").Where(f => f.get("age").GreaterThen(25))
let lazy_query7 = lazy_students.Select("name").Select("surname").Include("Courses", q => q.Select("grade").Where(f => f.get("grade").GreaterThen(5.5)))


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

let query10 = null! // TODO


// __Print result of the queries__

// // SELECT
// console.log(query1.toList().toArray())
// console.log(query2.toList().toArray())
// console.log(query3.toList().toArray())

// // INCLUDE
// console.log(query4.toList().toArray())

// // WHERE
// console.log(query5.toList().toArray())
// console.log(query6.toList().toArray())
// console.log(query7.toList().toArray())

// // ORDER BY
// console.log(query8.toList().toArray())
// console.log(query9.toList().toArray())


// __Execute the lazy queries, by applying the lazy_data to the query__

// // SELECT
// console.log(lazy_query1.apply(students).toList().toArray())
// console.log(lazy_query2.apply(students).toList().toArray())
// console.log(lazy_query3.apply(students).toList().toArray())

// // INCLUDE
// console.log(lazy_query4.apply(students).toList().toArray())

// // WHERE
// console.log(lazy_query5.apply(students).toList().toArray())
// console.log(lazy_query6.apply(students).toList().toArray())
// console.log(lazy_query7.apply(students).toList().toArray())

// // ORDER BY
// console.log(lazy_query8.apply(students).toList().toArray())
// console.log(lazy_query9.apply(students).toList().toArray())



/**
 * **TODO**: 
 * Questions: 
 * - Where operator [CHECK]
 * - Split Table in different interfaces so you can't call i.e. Where before Select [CHECK]
 * - Unit tests [CHECK only test the lazy table]
 * - Pass an array of unique arguments to the Select operator [DO NOT MENTION THIS]
 * - How to implement GroupBy? Type signature and implementation [A 9 is also good enough]
 * - Documentation + README
 * - Clean code 
 * - Prepare for presentation, going for 9 points:) yeaaaaaah!
*/

// Is this worth 2.5 points?
// I like the notation of because it is equivalent to the SQL notation of: SELECT name, age FROM students WHERE age >= 42 OR name = 'Carie'
let sample = students.Select('name', 'age').Where(f => f.get('age').SmallerOrEquals(50).Or(f => f.get('name').Equals('Carie')))
//console.log(sample.toList().toArray())


