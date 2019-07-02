import { List, Empty, merge_list_types, createList, Cons } from "./List";
import { Pair } from "./Pair";
import { Omit, omitMany, omitOne } from "../utils/Omit";
import { Unit } from "../types/Unit";
import { pickMany, pickOne } from "../utils/Pick";
import { Filter } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Comperator } from "../utils/Comperator";
import { mergeSort } from "../utils/mergeSort";
import { Data } from "../types/Data";
import { FilterBuilder, FilterCondition } from "./FilterBuilder";


export interface Table<T, U> {
    data: Data<T, U>

    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>

    Include: <K extends Filter<T, List<any>>, P extends keyof ListType<T[K]>>(
        record: K,
        q: (_: Table<ListType<T[K]>, Unit>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ) =>
        Table<Omit<T, K>, U & { [key in K]: /*List(We use Array for prety printing)*/Array<Pick<ListType<T[K]>, P>> }>

    Where: (filter: (_: FilterBuilder<T>) => FilterCondition<T>) => Table<T, U>

    OrderBy: <K extends keyof T>(attribute: K, order?: keyof Comperator<T>) => Table<T, U>

    GroupBy: <K extends keyof T>(attribute: K) => Table<T, U>

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
                ({ [record]: q(createTable(entry[record] as any)).toList().reverse().toArray() })))) as any
        ))
    },

    Where: function (filter: (_: FilterBuilder<T>) => FilterCondition<T>): Table<T, U> {
        let conditions: boolean[] = []

        // Filter the first list and store the condition in an array
        let list_T = this.data.First.reduce((s, x) => {
            let cond = filter(FilterBuilder(x)).condition
            conditions.push(cond)
            if (cond) {
                return Cons(x, s)
            } 
            return s
        }, Empty<T>())
        
        // Filter the second list based on the result of the first list
        let list_U = this.data.Second.reduce((s, x) => {
            if (conditions.pop()) {
                return Cons(x, s)
            }
            return s
        }, Empty<U>())

        return Table(Pair(list_T.reverse(), list_U.reverse()))
    },

    OrderBy: function <K extends keyof T>(attribute: K, order: keyof Comperator<T> = "ASC"): Table<T, U> {
        return Table(this.data.mapLeft(l => mergeSort(l, attribute, order)))
    },

    GroupBy: function <K extends keyof T>(attribute: K): Table<T, U> {
        let grouped = this.data.First.map(x => pickOne(x, attribute))
        //[{ age: 21 }, { age: 21 }, { age: 23 }, { age: 24}, { age: 24 }]
        throw 'Not implemented yet'
    },

    toList: function (this: Table<T, U>): List<U> {
        return this.data.Second
    }
})

// Factory method to create a table
export const createTable = <T>(list: List<T>): Table<T, Unit> => {
    return Table(Pair(list, createList(list.count())))
}