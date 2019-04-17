import { List, Empty } from "./List";
import { Pair } from "./Pair";
import { Omit } from "../utils/Omit";
import { Unit } from "../utils/Unit";

type Table<T, U> = {
    data: Pair<List<T>, List<U>>
    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>
    Include: <A, B>(record: Table<A, B>) => Table<T, U & B>
    Where: (predicate: boolean) => Table<T, U>
    OrderBy: (attribute: keyof T, order: "ASC" | "DESC") => Table<T, U>
    toList: (this: Table<T, U>) => List<U>
}

const Table = <T, U>(data: Pair<List<T>, List<U>>): Table<T, U> => ({
    data: data,
    Select: function <K extends keyof T>(this: Table<T, U>, ...properties: K[]): Table<Omit<T, K>, Pick<T, K> & U> {
        return null!
    },
    Include: function <A, B>(record: Table<A, B>): Table<T, U & B> {
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
    return Table(Pair(list, Empty()))
}