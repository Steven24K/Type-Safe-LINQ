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
import { Data } from "../types/Data";
import { FilterBuilder, FilterCondition } from "./FilterBuilder";



// export interface initialTable<T> {
//     data: Data<T, Unit>

//     Select: <K extends keyof T>(this: initialTable<T>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K>>
// }

// const initialTable = <T>(data: Data<T, Unit>): initialTable<T> => ({
//     data: data,

//     Select: function <K extends keyof T>(this: initialTable<T>, ...properties: K[]): Table<Omit<T, K>, Pick<T, K>> {
//         return Table(this.data.map(
//             first => first.map(entry => omitMany(entry, properties)),
//             second => merge_list_types(second.zip(this.data.First.map(entry => pickMany(entry, properties))))
//         ))
//     },
// })

export interface Table<T, U> {
    data: Data<T, U>

    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>

    Include: <K extends Filter<T, List<any>>, P extends keyof ListType<T[K]>>(
        record: K,
        q: (_: Table<ListType<T[K]>, Unit>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ) =>
        Table<Omit<T, K>, U & { [key in K]: /*List( We use Array for prety printing)*/Array<Pick<ListType<T[K]>, P>> }>
    //Table<{ The untouched set + the included values }, {name: string, Grades: [{ courseId: string, grade: number }]}>


    Where: (filter: (_: FilterBuilder<U>) => FilterCondition<U>) => Table<T, U>

    OrderBy: <K extends keyof U>(attribute: K, order?: keyof Comperator<T>) => Table<T, U>

    toList: (this: Table<T, U>) => List<U>
}

export const Table = <T, U>(data: Data<T, U>): Table<T, U> => ({
    data: data,

    Select: function <K extends keyof T>(this: Table<T, U>, ...properties: K[]): Table<Omit<T, K>, Pick<T, K> & U> {
        return Table(this.data.map(
            first => first.map(entry => omitMany(entry, properties)),
            second => merge_list_types(second.zip(this.data.First.map(entry => pickMany(entry, properties))))
        ))
    },

    Include: function <K extends Filter<T, List<any>>, P extends keyof ListType<T[K]>>(
        record: K,
        q: (_: Table<ListType<T[K]>, Unit>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ):
        Table<Omit<T, K>, U & { [key in K]: Array<Pick<ListType<T[K]>, P>> }> {
        return Table(this.data.map(
            first => first.map(entry => omitOne(entry, record)),
            second => merge_list_types(second.zip(this.data.First.map(entry =>
                ({ [record]: q(createTable(entry[record] as any)).toList().toArray() })))) as any
        ))
    },

    Where: function (filter: (_: FilterBuilder<U>) => FilterCondition<U>): Table<T, U> {
        return Table(this.data.mapRight(second => second.reduce((s, x) => {
            if (filter(FilterBuilder(x)).condition) {
                return Cons(x, s)
            }
            return s
        }, Empty<U>()).reverse()))
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