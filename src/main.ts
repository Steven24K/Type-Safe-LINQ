import { Cons, Empty, join_list, createList, List, merge_list_types } from "./core/List";
import { Student } from "./models/Student";
import { createTable, Table } from "./core/Table";
import { Pair } from "./core/Pair";
import { Unit } from "./utils/Unit";
import { Grade } from "./models/Grade";
import { Omit, omitMany } from "./utils/Omit";
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

//__TEST TABLE__
let student1: Student = { id: 1, name: "George", surname: "Strait", age: 66, email: "info@georgestrait.com" }
let student2: Student = { id: 2, name: "Brad", surname: "Paisley", age: 46, email: "info@bradpaisley.com" }
let student3: Student = { id: 3, name: "Kane", surname: "Brown", age: 25, email: "info@kanbrown.com" }
let student4: Student = { id: 4, name: "Luke", surname: "Bryan", age: 42, email: "info@lukebryan.com" }
let student5: Student = { id: 5, name: "Keith", surname: "Urban", age: 66, email: "info@keithurban.com" }
let student6: Student = { id: 6, name: "Blake", surname: "Shelton", age: 46, email: "info@blakeshelton.com" }
let student7: Student = { id: 7, name: "Carie", surname: "Underwood", age: 25, email: "info@carie.com" }
let student8: Student = { id: 8, name: "Miranda", surname: "Lambert", age: 42, email: "info@lambert.com" }

let grade1: Grade = { courseId: "SWE01", studentId: 1, grade: 5.5 }
let grade2: Grade = { courseId: "SWE01", studentId: 2, grade: 5.5 }
let grade3: Grade = { courseId: "SWE01", studentId: 3, grade: 5.5 }
let grade4: Grade = { courseId: "SWE01", studentId: 4, grade: 5.5 }

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
let q1 = t1.Select("name").Select("surname")
let q2 = t1.Select("name", "surname")

console.log(q1.toList().toArray())

/*
students.Select("name", "surname").Include("grades", q => q.Select("courseId", "grade")) is equivalent to the following SQL syntax: 
SELECT name, surname, courseId, grade
FROM students, grades
*/
let q3 = t1.Select("name", "surname").Include("Grade", q => q.Select("courseId", "grade", "studentId"))

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