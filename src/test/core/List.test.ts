import { Cons, Empty } from "../../core/List";
import { Func } from "../../utils/Func";
import { Pair } from "../../core/Pair";

let l1 = Cons(1, Cons(2, Cons(3, Empty())))
let l2 = Cons(true, Cons(true, Cons<boolean>(false, Empty())))
let l3 = Cons('a', Cons('b', Cons('c', Empty())))
let l4 = Cons(0, Cons(5, Cons(6, Empty())))
let l5 = Cons(53, Cons(3, Cons(82, Cons(7, Cons(-6, Cons(46, Cons(9, Empty())))))))

test(`List.reduce`, () => {
    let result = l3.reduce((s, x) => s + x, "")
    expect(result.length).toBe(3)
    expect(result).toBe("abc")
})

test(`List.map`, () => {
    let result = l1.map(x => x + 1)
    expect(JSON.stringify(result))
        .toEqual(JSON.stringify(Cons(2, Cons(3, Cons(4, Empty())))))
})

test(`List.reverse`, () => {
    let result = l1.reverse()
    expect(JSON.stringify(result))
        .toEqual(JSON.stringify(Cons(3, Cons(2, Cons(1, Empty())))))
})

test(`List.concat`, () => {
    let result = l3.concat(l1.map(x => x.toString()))
    expect(JSON.stringify(result))
        .toEqual(JSON.stringify(
            Cons('a', Cons('b', Cons('c', Cons('1', Cons('2', Cons('3', Empty()))))))
        ))
})

test(`List.toArray`, () => {
    let result = l2.toArray()
    expect(result).toEqual([true, true, false])
})

test(`List.bind`, () => {
    let result = l1.bind(l1_value =>
        l4.bind(l4_value =>
            Cons(l4_value == 0 ? -1 : l1_value / l4_value, Empty())))

    expect(JSON.stringify(result))
        .toEqual(JSON.stringify(
            Cons(-1, Cons(1 / 5, Cons(1 / 6,
                Cons(-1, Cons(2 / 5, Cons(2 / 6,
                    Cons(-1, Cons(3 / 5, Cons(3 / 6, Empty())))))))))
        ))
})

test(`List.count`, () => {
    expect(l2.count()).toBe(3)
})

test(`List.filter`, () => {
    let result = l2.filter(Func(x => !x))
    expect(JSON.stringify(result))
        .toEqual(JSON.stringify(
            Cons(false, Empty())
        ))
})

test(`List.splitAt`, () => {
    let result = l3.splitAt(0)
    expect(JSON.stringify(result))
        .toEqual(JSON.stringify(
            Pair(
                Cons('a', Empty()),
                Cons('b', Cons('c', Empty()))
            )
        ))
})

test(`List.zip`, () => {
    let result = l1.zip(l3)
    expect(JSON.stringify(result))
        .toEqual(JSON.stringify(
            Cons(Pair(1, 'a'), Cons(Pair(2, 'b'), Cons(Pair(3, 'c'), Empty())))
        ))
})

test(`List.merge ASC`, () => {
    let result = l1.merge(l4, "ASC")
    expect(JSON.stringify(result))
    .toEqual(JSON.stringify(
        Cons(0, Cons(1, Cons(2, Cons(3, Cons(5, Cons(6, Empty()))))))
    ))
})

test(`List.sort ASC`, () => {
    let result = l5.sort("ASC")
    expect(JSON.stringify(result))
    .toEqual(JSON.stringify(
        Cons(-6, Cons(3, Cons(7, Cons(9, Cons(46, Cons(53, Cons(82, Empty())))))))
    ))
})

test(`List.sort DESC`, () => {
    let result = l5.sort("DESC")
    expect(JSON.stringify(result))
    .toEqual(JSON.stringify(
        Cons(82, Cons(53, Cons(46, Cons(9, Cons(7, Cons(3, Cons(-6, Empty())))))))
    ))
})
