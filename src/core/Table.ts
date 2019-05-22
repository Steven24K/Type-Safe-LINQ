import { List, Empty, merge_list_types, createList, Cons } from "./List";
import { Pair } from "./Pair";
import { Omit, omitMany, omitOne } from "../utils/Omit";
import { Unit } from "../types/Unit";
import { pickMany } from "../utils/Pick";
import { Filter } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Func } from "../utils/Func";

export type Table<T, U> = {
    readonly data: Pair<List<T>, List<U>>
    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>
    Include: <R extends Filter<T, List<any>>, P extends keyof ListType<T[R]>>(
        record: R,
        q: (_: Table<ListType<T[R]>, Unit>) => Table<Omit<ListType<T[R]>, P>, Pick<ListType<T[R]>, P>>
    ) =>
        Table<Omit<T, R>, U & { [r in R]: List<Pick<ListType<T[R]>, P>> }>
    //Table<{ The untouched set + the included values }, {name: string, Grades: [{ courseId: string, grade: number }]}>


    Where: <F extends keyof U>(key: F, predicate: Func<U[F], boolean>) => Table<T, U>
    OrderBy: (attribute: keyof U, order: "ASC" | "DESC") => Table<T, U>
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

    Include: function <R extends Filter<T, List<any>>, P extends keyof ListType<T[R]>>(
        record: R,
        q: (_: Table<ListType<T[R]>, Unit>) => Table<Omit<ListType<T[R]>, P>, Pick<ListType<T[R]>, P>>
    ):
        Table<Omit<T, R>, U & { [r in R]: List<Pick<ListType<T[R]>, P>> }> {

        //this.data.First.bind(entry => q(createTable(entry[record])).toList() )

        return null!
    },

    Where: function <F extends keyof U>(key: F, predicate: Func<U[F], boolean>): Table<T, U> {
        return Table(this.data.mapRight(second => second.reduce((s, x) => {
            if (predicate.f(x[key])) {
                return Cons(x, s)
            }
            return s
        }, Empty<U>())))
    },
    OrderBy: function (attribute: keyof U, order: "ASC" | "DESC"): Table<T, U> {
        return Table(this.data.map(l1 => l1.sort(), l2 => l2.sort()))
    },
    toList: function (this: Table<T, U>): List<U> {
        return this.data.Second
    }
})


export const createTable = <T>(list: List<T>): Table<T, Unit> => {
    return Table(Pair(list, createList(list.count())))
}