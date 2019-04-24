import { List, Empty, merge_list_types, createList } from "./List";
import { Pair } from "./Pair";
import { Omit, omitMany } from "../utils/Omit";
import { Unit } from "../utils/Unit";
import { pickMany } from "../utils/Pick";
import { Context } from "./Context";

type Table<T, U> = {
    data: Pair<List<T>, List<U>>
    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>
    Include: <R extends keyof Context>(record: R, q: (_: Table<Context[R], Unit>) => Table<Omit<Context[R], keyof Context[R]> , Pick<Context[R], keyof Context[R]>>) => Table<T, Pick<Context[R], keyof Context[R] & U>>
    Where: (predicate: boolean) => Table<T, U>
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
    Include: function <R extends keyof Context>(record: R, q: (_: Table<Context[R], Unit>) => Table<Omit<Context[R], keyof Context[R]> , Pick<Context[R], keyof Context[R]>>): Table<T, Pick<Context[R], keyof Context[R] & U>> {
        return null!
    },
    Where: function (predicate: boolean): Table<T, U> {
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