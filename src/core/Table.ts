import { List, Empty, merge_list_types, createList } from "./List";
import { Pair } from "./Pair";
import { Omit, omitMany } from "../utils/Omit";
import { Unit } from "../utils/Unit";
import { pickMany } from "../utils/Pick";
import { Context } from "./Context";

type Table<T, U> = {
    data: Pair<List<T>, List<U>>
    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>
    Include: <R extends keyof Context, P extends keyof Context[R]>(
        record: R,
        data: Table<Context[R], Unit>,
        q: (_: Table<Context[R], Unit>) => Table<Omit<Context[R], P>, Pick<Context[R], P>>
    ) =>
        Table<T & { [record]: Array<Pick<Context[R], P>> }, U & { [record]: Array<Pick<Context[R], P>> }> //Table<{ The untouched set + the included values }, {name: string, Grades: [{ courseId: string, grade: number }]}>
        // It works when replaced with just 'record' without the square brackets []

    Where: (predicate: (_: keyof U) => boolean) => Table<T, U>
    OrderBy: (attribute: keyof T, order: "ASC" | "DESC") => Table<T, U>
    toList: (this: Table<T, U>) => List<U>
}

export const Table = <T, U>(data: Pair<List<T>, List<U>>): Table<T, U> => ({
    data: data,
    Select: function <K extends keyof T>(this: Table<T, U>, ...properties: K[]): Table<Omit<T, K>, Pick<T, K> & U> {
        let selection = this.data.First.map(entry => pickMany(entry, properties))

        let result = this.data.map(
            first => first.map(entry => omitMany(entry, properties))
            ,
            second => merge_list_types(second.zip(selection))
        )
        return Table(result)
    },
    Include: function <R extends keyof Context, P extends keyof Context[R]>(
        record: R,
        table: Table<Context[R], Unit>,
        q: (_: Table<Context[R], Unit>) => Table<Omit<Context[R], P>, Pick<Context[R], P>>
    ):
        Table<T & { [record]: Array<Pick<Context[R], P>> }, U & { [record]: Array<Pick<Context[R], P>> }> {
        let table_selection = q(table)
        let result = this.data.map(
            first => first.map(entry => ({ ...entry, [record]: table_selection})),
            second => second.map(entry => ({ ...entry, [record]: table_selection }))
        )

        return Table(result)
    },

    Where: function (predicate: (_: keyof U) => boolean): Table<T, U> {
        return null!
    },
    OrderBy: function (attribute: keyof T, order: "ASC" | "DESC"): Table<T, U> {
        return null!
    },
    toList: function (this: Table<T, U>): List<U> {
        return this.data.Second
    }
})


export const createTable = <T>(list: List<T>): Table<T, Unit> => {
    return Table(Pair(list, createList(list.count())))
}


type A = {
    x: string
    y: number
    c: boolean
}

type B = {
    d: boolean
    e: number
    f: number
}

/*
type C = {
    x: string
    y: number
    c: boolean\
    B: Array<B>
}
*/

type PosibleValue = {
    A: A
    B: B
}

type C<T, U, Name extends keyof PosibleValue> = T & { B: Array<U> }

let x = <T, U>(): T &  => {

}