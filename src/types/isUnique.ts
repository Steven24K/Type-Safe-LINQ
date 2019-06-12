import { Student } from "../models/Student";
import { pickMany } from "../utils/Pick";
import { Empty } from "../core/List";

/**
 * This is a workarround to generate an Array type that only contains unique values. This example uses recursive type aliases. 
 * 
 * For more informations @see https://stackoverflow.com/questions/56336955/how-can-i-make-sure-that-all-the-elements-in-an-array-are-unique/56337422#56337422
 * 
 */

type Tail<T extends any[]> = ((...a: T) => void) extends (p: any, ...t: infer P) => void ? P : [];

type UK0<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK1<Tail<T>, TErr, TOk>
type UK1<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK2<Tail<T>, TErr, TOk>
type UK2<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK3<Tail<T>, TErr, TOk>
type UK3<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK4<Tail<T>, TErr, TOk>
type UK4<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK5<Tail<T>, TErr, TOk>
type UK5<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK6<Tail<T>, TErr, TOk>
type UK6<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK7<Tail<T>, TErr, TOk>
type UK7<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK8<Tail<T>, TErr, TOk>
type UK8<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK9<Tail<T>, TErr, TOk>
type UK9<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK10<Tail<T>, TErr, TOk>
type UK10<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : UK11<Tail<T>, TErr, TOk>

type UK11<T extends any[], TErr, TOk> = T extends [] ? TOk : T[0] extends Tail<T>[number] ? TErr : "Array can only contain 10 unique elements"  

export type IsUnique<T extends any[]> = UK0<T, "There are duplicate values in the Array", {}>


// example

let Select = <K extends Array<keyof Student>>(s: Student, ...props: K & IsUnique<K>): Pick<Student, K[number]> => {
    return pickMany(s, props)
}

Select({name: "", surname: "", age: 4, gender: 'male' ,Courses: Empty()}, 'name', 'age')