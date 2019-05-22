import { omitOne, omitMany } from "../../utils/Omit";

type User = { name: string, surname: string, age: number, maried: boolean }
var test_user: User = { name: "something", surname: "Any", age: 21, maried: false }

test(`omitOne attribute from User, omit 'name'`, () => {
    expect(omitOne(test_user, "name")).toEqual({ surname: "Any", age: 21, maried: false })
})


test(`omitMany attributes from User, omit, 'name', 'age', 'maried'`, () => {
    expect(omitMany(test_user, ["name", "age", "maried"])).toEqual({ surname: "Any" })
})