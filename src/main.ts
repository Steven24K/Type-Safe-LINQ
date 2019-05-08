import { Cons, Empty, join_list, createList, List, merge_list_types } from "./core/List";
import { Student } from "./models/Student";
import { createTable, Table } from "./core/Table";
import { Pair } from "./core/Pair";
import { Unit } from "./utils/Unit";
import { Grade } from "./models/Grade";
import { Omit, omitMany, omitOne } from "./utils/Omit";
import { pickMany } from "./utils/Pick";


// __TEST LIST__
let x = Cons(1, Cons(2, Cons(3, Empty())))
let y = x.map(value => value + 3)
let z = x.concat(y)


let t = Cons(x, Cons(y, Empty()))
let r = join_list(t)

let b = x.bind(x_value =>
    y.bind(y_value => Cons(x_value + y_value, Empty())))

let l1 = Cons({ name: "Peter" }, Cons({ name: "Brad" }, Cons({ name: "Johnny" }, Cons({ name: "Carie" }, Empty()))))
let l2 = Cons({ surname: "Robinson" }, Cons({ surname: "Paisley" }, Cons({ surname: "Cash" }, Cons({ surname: "Underwood" }, Empty()))))



//console.log(l3.toArray())

// console.log(x.toArray())
// console.log(y.toArray())
// console.log(z.toArray())

// console.log(r.toArray())
// console.log(b.toArray())

//__TEST TABLE With dummy data__
let student1: Student = { id: 1, name: "George", surname: "Strait", age: 66, email: "info@georgestrait.com" }
let student2: Student = { id: 2, name: "Brad", surname: "Paisley", age: 46, email: "info@bradpaisley.com" }
let student3: Student = { id: 3, name: "Kane", surname: "Brown", age: 25, email: "info@kanbrown.com" }
let student4: Student = { id: 4, name: "Luke", surname: "Bryan", age: 42, email: "info@lukebryan.com" }
let student5: Student = { id: 5, name: "Keith", surname: "Urban", age: 66, email: "info@keithurban.com" }
let student6: Student = { id: 6, name: "Blake", surname: "Shelton", age: 46, email: "info@blakeshelton.com" }
let student7: Student = { id: 7, name: "Carie", surname: "Underwood", age: 25, email: "info@carie.com" }
let student8: Student = { id: 8, name: "Miranda", surname: "Lambert", age: 42, email: "info@lambert.com" }


let grade1: Grade = { courseId: "SWE01", studentId: 1, grade: 10 }
let grade2: Grade = { courseId: "DEV06", studentId: 2, grade: 7 }
let grade3: Grade = { courseId: "ANL7", studentId: 3, grade: 6 }
let grade4: Grade = { courseId: "DEV01", studentId: 4, grade: 8 }

let students = Cons(student1, Cons(student2, Cons(student3, Cons(student4,
    Cons(student5, Cons(student6, Cons(student7, Cons(student8, Empty()))))))))

let grades = Cons(grade1, Cons(grade2, Cons(grade3, Cons(grade4, Empty()))))

// Tables where the operation are on performed
let t1 = createTable(students)
let t2 = createTable(grades)

/*
students.Select("name").Select("surname") or students.Select("name", "surname") is equivalent to the following SQL syntax: 
SELECT name, surname
FROM students
*/

let q1 = t1.Select("name").Select("surname").Select("id").Select("age", "email")
let q2 = t1.Select("name", "surname")

// console.log(q1.toList().toArray())
// console.log(q2.toList().toArray())

/*
students.Select("name", "surname").Include("grades", q => q.Select("courseId", "grade")) is equivalent to the following SQL syntax: 
SELECT name, surname, courseId, grade
FROM students, grades
*/
let q3 = t1.Select("name", "surname").Select("id").Include("Grades", t2, q => q.Select("courseId", "grade").Select("studentId"))

console.log(q3.toList().toArray())

/*
students.Select("name", "surname").Include("grades", q => q.Select("courseId", "grade")).WHERE(q => grades.studentId == q.studentId) is equivalent to the following SQL syntax: 
SELECT name, surname, courseId, grade
FROM students, grades
WHERE students.studentId = grades.studentId
*/










// __Step by step selection process__

const data = Pair<List<Student>, List<Unit>>(students, createList(students.count()))
const selectedData = data.First.map(entry => pickMany(entry, ["name"]))

const result = data.map(
    first => first.map(entry => omitMany(entry, ["name"]))
    ,
    second => merge_list_types(second.zip(selectedData)))

const Data2 = result
const selectedData2 = data.First.map(entry => pickMany(entry, ["surname"]))

const result2 = Data2.map(
    first => first.map(entry => omitMany(entry, ["surname"]))
    ,
    second => merge_list_types(second.zip(selectedData2))
)

//console.log(result2.First.toArray())



// Omiting properties 

// First I make some interface that contains some structure for data
interface SomeObject { x: string, y: number, z: boolean }

// Initialize object1 with properties x, y and z, containing the important data
// I want to preserve all the data in object1 throug the entire program
let object1: SomeObject = { x: "something", y: 0, z: false }

// let object2 = omitMany(object1, ["x", "y", "z"])
// console.log(object1.x)


/*
// I can print all properties of object1
console.log(`Object 1: x = ${object1.x}, y = ${object1.y}, z = ${object1.z}`) 
// OUTPUT: "Object 1: x = something, y = 0, z = false"

// omit or delete property 'x' from object 1, defining object 2
let object2 = omitMany(object1, ["x"]) // The type of object2 is: {y: number, z: boolean}
// Here I can only get properties z and y, because x has been omited
// Calling: object2.x gives an compile error
console.log(`Object 2: y = ${object2.y}, z = ${object2.z}`)
// OUTPUT: Object 2: y = 0, z = false (as expected)

// Everything works fine from here, but...
// When I recall omitMany on object1 the following happens: 

// Initialize object3 from object1, removing 'x' from an object where x = undefined
let object3 = omitMany(object1, ["x"]) // This code compiles, omiting 'x' from object2 gives an compiler error
//Printing object3 does show no problems, since it satisfies the expected result. Remove 'x' and keep 'y' and 'z'
console.log(`Object 3: y = ${object3.y}, z = ${object3.z}`)
// OUTPUT: Object 3: y = 0, z = false

// But when I print object1 again
console.log(`Object 1: x = ${object1.x}, y = ${object1.y}, z = ${object1.z}`) 
// OUTPUT: Object 1: x = undefined, y = 0, z = false 
// We lost the data of 'x'!!!


// I also ran into problems when I try to pick property 'x' from the original object1 
let object4 = pickMany(object1, ["x"]) // The type of object4 is {x: string}
// When I print 'x' from object4 it is still undefined
console.log(`Object 4: x = ${object4.x}`) 
// OUTPUT: Object 4: x = undefined

// I understand that this has to do with the behaviour of delete
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete
// But is there an alternative of deleting or omiting a property from an object, without loosing the original object? 

*/