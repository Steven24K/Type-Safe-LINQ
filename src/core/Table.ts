import { List, Empty, merge_list_types, createList, Cons } from "./List";
import { Pair } from "./Pair";
import { Omit, omitMany, omitOne } from "../utils/Omit";
import { Unit } from "../types/Unit";
import { pickMany } from "../utils/Pick";
import { Filter } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Func } from "../utils/Func";
import { Comperator } from "../utils/Comperator";
import { mergeSort } from "../utils/mergeSort";


export interface Table<T, U> {
    readonly data: Pair<List<T>, List<U>>
    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>

    Include: <K extends Filter<T, List<any>>, P extends keyof ListType<T[K]>>(
        record: K,
        q: (_: Table<ListType<T[K]>, Unit>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ) =>
        Table<Omit<T, K>, U & { [key in K]: /*List( We use Array for prety printing)*/Array<Pick<ListType<T[K]>, P>> }>
    //Table<{ The untouched set + the included values }, {name: string, Grades: [{ courseId: string, grade: number }]}>


    Where: <K extends keyof U>(key: K, predicate: Func<U[K], boolean>) => Table<T, U>

    OrderBy: <K extends keyof U>(attribute: K, order?: keyof Comperator<T>) => Table<T, U>

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

    Include: function <K extends Filter<T, List<any>>, P extends keyof ListType<T[K]>>(
        record: K,
        q: (_: Table<ListType<T[K]>, Unit>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ):
        Table<Omit<T, K>, U & { [key in K]: Array<Pick<ListType<T[K]>, P>> }> {

        let result1 = this.data.First.map(entry => ({ [record]: q(createTable(entry[record] as any)).toList().toArray() }))

        let result2 = this.data.Second.zip(result1)

        let result3 = merge_list_types(result2)

        let removed_record = this.data.First.map(entry => omitOne(entry, record))

        return Table(Pair(removed_record, result3)) as any
    },

    Where: function <K extends keyof U>(key: K, predicate: Func<U[K], boolean>): Table<T, U> {
        return Table(this.data.mapRight(second => second.reduce((s, x) => {
            if (predicate.f(x[key])) {
                return Cons(x, s)
            }
            return s
        }, Empty<U>())))
    },

    OrderBy: function <K extends keyof U>(attribute: K, order: keyof Comperator<T> = "ASC"): Table<T, U> {
        return Table(this.data.mapRight(l => mergeSort(l, attribute, order)))
    },

    toList: function (this: Table<T, U>): List<U> {
        return this.data.Second
    }
})

// Factory method to create a table
export const createTable = <T>(list: List<T>): Table<T, Unit> => {
    return Table(Pair(list, createList(list.count())))
}