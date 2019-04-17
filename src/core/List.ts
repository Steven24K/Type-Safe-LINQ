import { Func } from "../utils/Func";

type ListType<T> = {
    Kind: "Cons",
    Head: T,
    Tail: List<T>
} | {
    Kind: "Empty"
}

type ListOperations<T> = {
    reduce: <U>(this: List<T>, f: (state: U, x: T) => U, accumulator: U) => U
    map: <U>(this: List<T>, f: (_: T) => U) => List<U>
    reverse: (this: List<T>) => List<T>
    concat: (this: List<T>, l: List<T>) => List<T>
    toArray: (this: List<T>) => T[]
    join: (this: List<List<T>>) => List<T>
    bind: <U>(this: List<T>, q: (x: T) => List<U>) => List<U>
}

export type List<T> = ListType<T> & ListOperations<T>

export const join_list = <T>(list: List<List<T>>): List<T> => {
    return list.reduce((s, x) => s.concat(x), Empty())
}

const ListOperations = <T>(): ListOperations<T> => ({
    reduce: function <U>(this: List<T>, f: (state: U, x: T) => U, accumulator: U): U {
        return this.Kind == "Empty" ? accumulator : this.Tail.reduce(f, f(accumulator, this.Head))
    },
    map: function <U>(this: List<T>, f: (_: T) => U): List<U> {
        return this.reduce<List<U>>((s, x) => Cons(f(x), s), Empty<U>()).reverse()
    },
    reverse: function (this: List<T>): List<T> {
        return this.reduce((s, x) => Cons(x, s), Empty())
    },
    concat: function (this: List<T>, l: List<T>): List<T> {
        return this.reverse().reduce((s, x) => Cons(x, s), l)
    },
    toArray: function (this: List<T>): T[] {
        return this.reduce<T[]>((s, x) => s.concat([x]), [])
    },
    join: function (this: List<List<T>>): List<T> {
        return join_list(this)
    },
    bind: function <U>(this: List<T>, q: (x: T) => List<U>): List<U> {
        return join_list(this.map(q))
    },

})

export const Cons = <T>(head: T, tail: List<T>): List<T> => ({
    Kind: "Cons",
    Head: head,
    Tail: tail,
    ...ListOperations()
})

export const Empty = <T>(): List<T> => ({
    Kind: "Empty",
    ...ListOperations()
})


// let x = Cons(1, Cons(2, Cons(3, Cons(4, Empty()))))
// let y = x.map(x => x + 4)

// let z = Cons(x, Cons(y, Empty()))
// join_list(z)
