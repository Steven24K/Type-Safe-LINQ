import { List, Empty, merge_list_types, createList, Cons } from "./List";
import { Pair } from "./Pair";
import { Omit, omitMany, omitOne } from "../utils/Omit";
import { Unit } from "../types/Unit";
import { pickMany, pickOne } from "../utils/Pick";
import { Filter, PickIf } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Comperator } from "../utils/Comperator";
import { mergeSort } from "../utils/mergeSort";
import { Data } from "../types/Data";
import { FilterBuilder, FilterCondition } from "./FilterBuilder";

export interface initialTable<T> {
    data: Data<T, Unit>
    Select: <K extends keyof T>(this: initialTable<T>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K>>

}

export interface Table<T, U> {
    data: Data<T, U>

    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>

    Include: <K extends Filter<T, List<any>>, P extends keyof ListType<T[K]>>(
        record: K,
        q: (_: initialTable<ListType<T[K]>>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ) =>
        Table<Omit<T, K>, U & { [key in K]: /*List( We use Array for prety printing)*/Array<Pick<ListType<T[K]>, P>> }>

    Where: (filter: (_: FilterBuilder<PickIf<T & U, string | boolean | number>>) => FilterCondition<PickIf<T & U, string | boolean | number>>) => Table<T, U>

    OrderBy: <K extends keyof U>(attribute: K, order?: keyof Comperator<T>) => Table<T, U>

    Count: <K extends keyof U>(attribute: K) => Table<T, Omit<U, K> & { [key in K]: number }>

    GroupBy: <K extends keyof U>(attribute: K) => Table<T, U>

    toList: (this: Table<T, U>) => List<U>
}

export const initialTable = <T>(data: Data<T, Unit>): initialTable<T> => ({
    data: data,

    Select: function <K extends keyof T>(this: initialTable<T>, ...properties: K[]): Table<Omit<T, K>, Pick<T, K>> {
        return Table(this.data.map(
            first => first.map(entry => omitMany(entry, properties)),
            second => merge_list_types(second.zip(this.data.First.map(entry => pickMany(entry, properties))))
        ))
    }
})

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
        q: (_: initialTable<ListType<T[K]>>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ):
        Table<Omit<T, K>, U & { [key in K]: Array<Pick<ListType<T[K]>, P>> }> {
        return Table(this.data.map(
            first => first.map(entry => omitOne(entry, record)),
            second => merge_list_types(second.zip(this.data.First.map(entry =>
                ({ [record]: q(createTable(entry[record] as any)).toList().reverse().toArray() })))) as any
        ))
    },

    Where: function (filter: (_: FilterBuilder<PickIf<T & U, string | boolean | number>>) => FilterCondition<PickIf<T & U, string | boolean | number>>): Table<T, U> {
        let tmp_First = this.data.First
        let tmp_Second = this.data.Second
        let result = Empty<U>()
        while (tmp_First.Kind != 'Empty' && tmp_Second.Kind != 'Empty') {
            if (filter(FilterBuilder<PickIf<T & U, string | boolean | number>>({ ...tmp_First.Head, ...tmp_Second.Head })).condition) {
                result = Cons(tmp_Second.Head, result)
            }
            tmp_First = tmp_First.Tail
            tmp_Second = tmp_Second.Tail
        }
        return Table(Pair(this.data.First, result.reverse()))
    },

    OrderBy: function <K extends keyof U>(attribute: K, order: keyof Comperator<T> = "ASC"): Table<T, U> {
        return Table(this.data.mapRight(l => mergeSort(l, attribute, order)))
    },

    Count: function<K extends keyof U>(attribute: K): Table<T, Omit<U, K> & { [key in K]: number }> {
        return Table(this.data.mapRight(snd => snd.map(l => ({...omitOne(l, attribute), [attribute]: snd.count()} as Omit<U, K> & { [key in K]: number }))))
    },

    GroupBy: function <K extends keyof U>(attribute: K): Table<T, U> {
        let grouped = this.data.Second.map(x => pickOne(x, attribute))
        //[{ age: 21 }, { age: 21 }, { age: 23 }, { age: 24}, { age: 24 }]
        return null!
    },

    toList: function (this: Table<T, U>): List<U> {
        return this.data.Second
    }
})

// Factory method to create a table
export const createTable = <T>(list: List<T>): initialTable<T> => {
    return initialTable(Pair(list, createList(list.count())))
}