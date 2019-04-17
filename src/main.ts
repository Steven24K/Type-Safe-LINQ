import { Cons, Empty, join_list } from "./core/List";
import { Student } from "./models/Student";
import { createTable } from "./core/Table";
import { Pair } from "./core/Pair";
import { Unit } from "./utils/Unit";
import { Grade } from "./models/Grade";

// __TEST LIST__
let x = Cons(1, Cons(2, Cons(3, Empty())))
let y = x.map(value => value + 3)
let z = x.concat(y)


let t = Cons(x, Cons(y, Empty()))
let r = join_list(t)

let b = x.bind(x_value =>
    y.bind(y_value => Cons(x_value + y_value, Empty())))

console.log(x.toArray())
console.log(y.toArray())
console.log(z.toArray())

console.log(r.toArray())
console.log(b.toArray())

//__TEST TABLE__
let student1: Student = { name: "George", surname: "Strait", age: 66, email: "info@georgestrait.com" }
let student2: Student = { name: "Brad", surname: "Paisley", age: 46, email: "info@bradpaisley.com" }
let student3: Student = { name: "Kane", surname: "Brown", age: 25, email: "info@kanbrown.com" }
let student4: Student = { name: "Luke", surname: "Bryan", age: 42, email: "info@lukebryan.com" }
let student5: Student = { name: "Keith", surname: "Urban", age: 66, email: "info@keithurban.com" }
let student6: Student = { name: "Blake", surname: "Shelton", age: 46, email: "info@blakeshelton.com" }
let student7: Student = { name: "Carie", surname: "Underwood", age: 25, email: "info@carie.com" }
let student8: Student = { name: "Miranda", surname: "Lambert", age: 42, email: "info@lambert.com" }

let grade1: Grade = { courseId: "SWE01", studentId: 1, grade: 5.5 }
let grade2: Grade = { courseId: "SWE01", studentId: 1, grade: 5.5 }
let grade3: Grade = { courseId: "SWE01", studentId: 1, grade: 5.5 }
let grade4: Grade = { courseId: "SWE01", studentId: 1, grade: 5.5 }

let students = Cons(student1, Cons(student2, Cons(student3, Cons(student4,
    Cons(student5, Cons(student6, Cons(student7, Cons(student8, Empty()))))))))

let grades = Cons(grade1, Cons(grade2, Cons(grade3, Cons(grade4, Empty()))))

/*
students.Select("name").Select("surname") or students.Select("name", "surname") is equivalent to the following SQL syntax: 
SELECT name, surname
FROM students

students.Select("name", "surname").Include(grades) is equivalent to the following SQL syntax: 
SELECT name, surname
FROM students, grades
*/

let t1 = createTable(students)
let t2 = createTable(grades)

let q1 = t1.Select("name").Select("age").Select("email").Select("surname")
let q2 = t1.Select("name", "age", "email", "surname")
let q3 = t1.Select("name", "age").Select("email", "surname")

// TODO REFACTOR Include
let q4 = t1.Select("name", "surname").Include(t2.Select("courseId", "grade")).toList()