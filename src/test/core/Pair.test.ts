import { Pair } from "../../core/Pair";

let p1 = Pair(2, "hello")
let p2 = Pair(true, 6)
let p3 = Pair("false", false)


test(`Pair map`, () => {
    let result = p1.map(x => x * 2, y => y.length)
    expect(result.First).toBe(4)
    expect(result.Second).toBe(5)
})

test(`Pair mapLeft`, () => {
    let result = p2.mapLeft(x => !x)
    expect(result.First).toBe(false)
    expect(result.Second).toBe(6)
})

test(`Pair mapRight`, () => {
    var result = p3.mapRight(x => !x)
    expect(result.First).toBe("false")
    expect(result.Second).toBe(true)
})