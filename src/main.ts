import { Cons, Empty, ListFromArray } from "./core/List";
import { Student } from "./models/Student";
import { createTable } from "./core/Table";
import { createLazyTable } from "./core/LazyTable";
import { Course } from "./models/Course";
import { DataGenerator } from "./utils/DataGenerator";

/**
 * **TODO**: 
 * Questions: 
 * - Where operator [CHECK]
 * - Split Table in different interfaces so you can't call i.e. Where before Select [CHECK]
 * - Unit tests [CHECK]
 * - Clean code [CHECK]
 * - Documentation + README [CHECK]
 * - Make random data generator [CHECK]
 * - Pass an array of unique arguments to the Select operator *A new implementation of the pickMany and omitMany is needed*
 * - How to implement GroupBy? Type signature and implementation *A 9 is also good enough*
*/


//__TEST TABLE With dummy data__ put all data in one List
let student_data = DataGenerator(1000)

// Tables where the operation are on performed
let students = createTable(student_data)

// A LazyTable which only returns a chain of composable functions to execute
let lazy_students = createLazyTable<Student>()

// Just a complex example query that uses all operators
let sample = students.Select('name', 'surname').Select('age', 'gender')
    .Include('Courses', q =>
        q.Select('grade', 'name')
            .Where(f =>
                f.get('grade').GreaterOrEquals(5.5)
                    .Or(f =>
                        f.get('name').In(['Software Engineering', 'Development 8', 'Project 7/8'])))
            .OrderBy('grade', 'ASC'))
    .Where(f =>
        f.get('name').StartsWith('Ste')
            .Or(f =>
                f.get('age').Equals(21)))
    .OrderBy('age', 'DESC')

// console.log(sample.toList().toArray())


/**
 * **SELECT**
 * 
 * students.Select('name', 'surname')
 * 
 * SELECT name, surname
 * FROM students
 */
let query1 = students.Select("name", "surname") // q1 and q2 have the same type
let query2 = students.Select("name").Select("surname")
let query3 = students.Select("name").Select("surname").Select("gender").Select("age", "Courses") // Arguments of the next Select results in never[]

// console.log(query1.toList().toArray())
// console.log(query2.toList().toArray())
// console.log(query3.toList().toArray())

let lazy_query1 = lazy_students.Select("name", "surname")
let lazy_query2 = lazy_students.Select("name").Select("surname")
let lazy_query3 = lazy_students.Select("name").Select("surname").Select("gender").Select("age", "Courses")

// console.log(lazy_query1.apply(students).toList().toArray())
// console.log(lazy_query2.apply(students).toList().toArray())
// console.log(lazy_query3.apply(students).toList().toArray())

//-------------------------------------------------


/**
 * **INCLUDE**
 * 
 * students.Select('name', 'surname').Include('Courses', q => q.Select('grade', 'studypoints'))
 * 
 * SELECT name, surname, grade, studypoints
 * FROM students, courses
 * WHERE courses.studentId = students.Id (assuming that you have a relation)
 */
let query4 = students.Select("name", "surname").Include("Courses", q => q.Select("grade", "studypoints"))

// console.log(query4.toList().toArray())

let lazy_query4 = lazy_students.Select("name", "surname").Include("Courses", q => q.Select("grade", "studypoints"))

// console.log(lazy_query4.apply(students).toList().toArray())

//-------------------------------------------------


/**
 * **WHERE**
 * 
 * students.Select('name', 'surname', 'age').Where(f => f.get('age').GreaterThen(25))
 * 
 * SELECT name, surname, age
 * FROM students
 * WHERE age > 25
 */
let query5 = students.Select("name", "surname", "age").Where(f => f.get("surname").StartsWith("B").And(f => f.get("surname").EndsWith("n")))
let query6 = students.Select("name", "surname", "age").Where(f => f.get("age").GreaterThen(25))
let query7 = students.Select("name").Select("surname").Include("Courses", q => q.Select("grade").Where(f => f.get("grade").GreaterThen(5.5)))


// console.log(query5.toList().toArray())
// console.log(query6.toList().toArray())
// console.log(query7.toList().toArray())

let lazy_query5 = lazy_students.Select("name", "surname", "age").Where(f => f.get("surname").StartsWith("B").And(f => f.get("surname").EndsWith("n")))
let lazy_query6 = lazy_students.Select("name", "surname", "age").Where(f => f.get("age").GreaterThen(25))
let lazy_query7 = lazy_students.Select("name").Select("surname").Include("Courses", q => q.Select("grade").Where(f => f.get("grade").GreaterThen(5.5)))

// console.log(lazy_query5.apply(students).toList().toArray())
// console.log(lazy_query6.apply(students).toList().toArray())
// console.log(lazy_query7.apply(students).toList().toArray())

//-------------------------------------------------


/**
 * **ORDER BY**
 * 
 * students.Select('name', 'surname', 'age').OrderBy('age', 'DESC')
 * 
 * SELECT name, surname, age
 * FROM students
 * ORDER BY age DESC
 */

let query8 = students.Select("name", "surname", "age").OrderBy("age", "DESC")
let query9 = students.Select("name", "surname").OrderBy("name", "ASC")

// console.log(query8.toList().toArray())
// console.log(query9.toList().toArray())

let lazy_query8 = lazy_students.Select("name", "surname", "age").OrderBy("age", "DESC")
let lazy_query9 = lazy_students.Select("name", "surname").OrderBy("name", "ASC")

// console.log(lazy_query8.apply(students).toList().toArray())
// console.log(lazy_query9.apply(students).toList().toArray())

//-------------------------------------------------


/**
 * **COUNT**
 */
let query11 = students.Select('name').Count('name')

console.log(query11.toList().toArray())


/**
 * **GROUP BY**
 * 
 * students.Select('name').Include('Courses', q => q.Select("grade")).GroupBy(???)
 * 
 * SELECT name, AVG(grade)
 * FROM students, grades
 * GROUP BY name
 */
let query10 = null! // TODO







