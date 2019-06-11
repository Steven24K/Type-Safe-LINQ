import { Student } from "../../models/Student";
import { Cons, Empty } from "../../core/List";
import { Course } from "../../models/Course";
import { FilterBuilder } from "../../core/FilterBuilder";

let myStudent: Student = {
    name: "Willie", 
    surname: "Nelson", 
    age: 71,
    gender: "male",
    Courses: Cons<Course>({
        grade: 9,
        name: "SWE",
        studypoints: 99
    }, Cons<Course>({
        grade: 9,
        name: "SWE",
        studypoints: 99
    }, Cons<Course>({
        grade: 9,
        name: "SWE",
        studypoints: 99
    }, Cons<Course>({
        grade: 9,
        name: "SWE",
        studypoints: 99
    }, Empty()))))
}

let myFilter: FilterBuilder<Student> = FilterBuilder(myStudent)


test(`test WhereOperator.Equals`, () => {
    expect(myFilter.get('name').Equals('Willie').condition).toBe(true)
    expect(myFilter.get('age').Equals(72).condition).toBe(false)
})

test(`test WhereOperator.NotEquals`, () => {
    expect(myFilter.get('name').NotEquals('Bob').condition).toBe(true)
    expect(myFilter.get('age').NotEquals(71).condition).toBe(false)
})

test(`test WhereOperator.GreaterThen`, () => {
    expect(myFilter.get('name').GreaterThen('V').condition).toBe(true)
    expect(myFilter.get('name').GreaterThen('W').condition).toBe(true)
    expect(myFilter.get('name').GreaterThen('X').condition).toBe(false)

    expect(myFilter.get('age').GreaterThen(70).condition).toBe(true)
    expect(myFilter.get('age').GreaterThen(71).condition).toBe(false)
    expect(myFilter.get('age').GreaterThen(72).condition).toBe(false)
})

test('test WhereOperator.SmallerThen', () => {
    expect(myFilter.get('name').SmallerThen('V').condition).toBe(false)
    expect(myFilter.get('name').SmallerThen('W').condition).toBe(false)
    expect(myFilter.get('name').SmallerThen('X').condition).toBe(true)

    expect(myFilter.get('age').SmallerThen(70).condition).toBe(false)
    expect(myFilter.get('age').SmallerThen(71).condition).toBe(false)
    expect(myFilter.get('age').SmallerThen(72).condition).toBe(true)
})

test(`test WhereOperator.GreaterOrEquals`, () => {
    expect(myFilter.get('name').GreaterOrEquals('V').condition).toBe(true)
    expect(myFilter.get('name').GreaterOrEquals('W').condition).toBe(true)
    expect(myFilter.get('name').GreaterOrEquals('X').condition).toBe(false)

    expect(myFilter.get('age').GreaterOrEquals(70).condition).toBe(true)
    expect(myFilter.get('age').GreaterOrEquals(71).condition).toBe(true)
    expect(myFilter.get('age').GreaterOrEquals(72).condition).toBe(false)
})

test(`test WhereOperator.SmallerOrEquals` ,() => {
    expect(myFilter.get('name').SmallerOrEquals('V').condition).toBe(false)
    expect(myFilter.get('name').SmallerOrEquals('W').condition).toBe(false)
    expect(myFilter.get('name').SmallerOrEquals('X').condition).toBe(true)

    expect(myFilter.get('age').SmallerOrEquals(70).condition).toBe(false)
    expect(myFilter.get('age').SmallerOrEquals(71).condition).toBe(true)
    expect(myFilter.get('age').SmallerOrEquals(72).condition).toBe(true)
})

test(`test WhereOperator.Between` ,() => {
    expect(myFilter.get('name').Between('V', 'X').condition).toBe(true)
    expect(myFilter.get('age').Between(70, 72).condition).toBe(true)
})

test(`test WhereOperator.Contains` ,() => {
    expect(myFilter.get('name').Contains('ill').condition).toBe(true)
})


test(`test WhereOperator.StartsWith` ,() => {
    expect(myFilter.get('name').StartsWith('Wi').condition).toBe(true)
})

test(`test WhereOperator.EndsWith` ,() => {
    expect(myFilter.get('name').EndsWith('ie').condition).toBe(true)
})


test(`test FilterCondition.And` ,() => {
    expect(myFilter.get('age').Equals(71).And(f => f.get('name').Equals('Willie')).condition).toBe(true)
    expect(myFilter.get('age').Equals(71).Not().And(f => f.get('name').Equals('Willie')).condition).toBe(false)
    expect(myFilter.get('age').Equals(71).And(f => f.get('name').Equals('Willie').Not()).condition).toBe(false)
    expect(myFilter.get('age').Equals(71).And(f => f.get('name').Equals('Willie')).Not().condition).toBe(false)
})


test(`test FilterCondition.Or` ,() => {
    expect(myFilter.get('age').Equals(71).Or(f => f.get('name').Equals('Willie')).condition).toBe(true)
    expect(myFilter.get('age').Equals(71).Not().Or(f => f.get('name').Equals('Willie')).condition).toBe(true)
    expect(myFilter.get('age').Equals(71).Or(f => f.get('name').Equals('Willie').Not()).condition).toBe(true)
    expect(myFilter.get('age').Equals(71).Or(f => f.get('name').Equals('Willie')).Not().condition).toBe(false)
})

test(`test FilterCondition.Not` ,() => {
    expect(myFilter.get('surname').Equals('Nelson').Not().condition).toBe(false)
})