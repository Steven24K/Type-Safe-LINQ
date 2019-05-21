import { Pair } from "./Pair";
import { Unit } from "../utils/Unit";
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
    bind: <U>(this: List<T>, q: (x: T) => List<U>) => List<U>
    count: (this: List<T>) => number
    filter: (this: List<T>, predicate: Func<T, boolean>) => List<T>
    splitAt: (this: List<T>, i: number) => Pair<List<T>, List<T>>
    zip: <U>(this: List<T>, list: List<U>) => List<Pair<T, U>>
    merge: (this: List<T>, list: List<T>) => List<T>
    sort: (this: List<T>) => List<T>
}

export type List<T> = ListType<T> & ListOperations<T>

export const join_list = <T>(list: List<List<T>>): List<T> => {
    return list.reduce((s, x) => s.concat(x), Empty())
}

export const merge_list_types = <T, U>(list_pair: List<Pair<T, U>>): List<T & U> => {
    return list_pair.map<T & U>(p => ({ ...p.First, ...p.Second }))
}

export const createList = (n: number): List<Unit> => {
    return n == 0 ? Empty() : Cons({}, createList(n - 1))
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
    bind: function <U>(this: List<T>, q: (x: T) => List<U>): List<U> {
        return join_list(this.map(q))
    },
    count: function (this: List<T>): number {
        return this.reduce((s, x) => s + 1, 0)
    }, 
    filter: function (this: List<T>, predicate: Func<T, boolean>): List<T> {
        return this.reduce((s, x) => {
            if (predicate.f(x)) {
                return Cons(x, s)
            } else {
                return s
            }
        }, Empty())
    },
    splitAt: function (this: List<T>, i: number): Pair<List<T>, List<T>> {
        if (this.Kind == "Empty") {
            throw "Cannot split empty list"
        } else if(i == 0) {
            return Pair(Cons(this.Head, Empty()), this.Tail)
        } else {
            let t = this.Tail.splitAt(i-1)
            return Pair(Cons(this.Head, t.First), t.Second)
        }
    },
    zip: function <U>(this: List<T>, list: List<U>): List<Pair<T, U>> {
        if (this.count() != list.count()) {
            throw "Not equal length exception"
        } else if (this.Kind == "Empty" && list.Kind == "Empty") {
            return Empty()
        } else if (this.Kind == "Cons" && list.Kind == "Cons") {
            return Cons(Pair(this.Head, list.Head), this.Tail.zip(list.Tail))
        } else {
            throw "Something went wrong exception"
        }
    }, 
    merge: function (this: List<T>, list: List<T>): List<T> {
        if (this.Kind == "Empty") {
            return list
        } else if (list.Kind == "Empty") {
            return this
        } else {
            if (this.Head <= list.Head) {
                return Cons(this.Head, this.Tail.merge(list))
            } else {
                return Cons(list.Head, this.merge(list.Tail))
            }
        }
    },
    sort: function (this: List<T>): List<T> {
        if (this.count() == 1) {
            return this
        } else {
            let middle = Math.floor(this.count() / 2 -1)
            let p = this.splitAt(middle)
            let left = p.First.sort()
            let right = p.Second.sort()
            return left.merge(right)
        }
    }

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
