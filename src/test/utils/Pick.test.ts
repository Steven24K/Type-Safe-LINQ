import { pickOne, pickMany } from "../../utils/Pick";

type User = { name: string, surname: string, age: number, maried: boolean }
var test_user: User = { name: "something", surname: "Any", age: 21, maried: false }


test(`pickOne attribute from User, pick 'name'`, () => {
    expect(pickOne(test_user, "name")).toEqual({ name: "something" })
})

test(`PickMany attributes from User, pick 'name', 'age', 'maried'`, () => {
    expect(pickMany(test_user, ["name", "age", "maried"])).toEqual({ name: "something", age: 21, maried: false })
})

