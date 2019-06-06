import { Func, Identity } from "../utils/Func";
import { Omit, omitMany, omitOne } from "../utils/Omit";
import { merge_list_types, List, Cons, Empty, createList } from "./List";
import { pickMany } from "../utils/Pick";
import { Pair } from "./Pair";
import { Unit } from "../types/Unit";
import { Filter } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Comperator } from "../utils/Comperator";
import { mergeSort } from "../utils/mergeSort";
import { Table, createTable, initialTable } from "./Table";
import { Data } from "../types/Data";
import { Query } from "../types/Query";


type initialData<T> = Data<T, Unit>


type initialLazyTable<T1, U1, T2, U2> = {
    query: Query<T1, U1, T2, U2>

    Select: <K extends keyof T2>(...properties: K[]) => LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>>
}

const initialLazyTable = <T1, U1, T2, U2>(q: Query<T1, U1, T2, U2>): initialLazyTable<T1, U1, T2, U2> => ({
    query: q, 

    Select: function <K extends keyof T2>(...properties: K[]): LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>> {
        return LazyTable(this.query.then(Func(data => data.map(
            first => first.map(entry => omitMany(entry, properties)),
            second => merge_list_types(second.zip(data.First.map(entry =>
                pickMany(entry, properties)))))
        )))
    },
})


type LazyTable<T1, U1, T2, U2> = {
    query: Query<T1, U1, T2, U2>

    Select: <K extends keyof T2>(...properties: K[]) => LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>>

    Include: <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: initialTable<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ) => LazyTable<T1, U1, Omit<T2, K>, U2 & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }>

    Where: <K extends keyof U2>(key: K, predicate: Func<U2[K], boolean>) => LazyTable<T1, U1, T2, U2>

    OrderBy: <K extends keyof U2>(attribute: K, order?: keyof Comperator<T2>) => LazyTable<T1, U1, T2, U2>

    apply: (data: Data<T1, U1>) => Table<T2, U2>
}

const LazyTable = <T1, U1, T2, U2>(q: Query<T1, U1, T2, U2>): LazyTable<T1, U1, T2, U2> => ({
    query: q,

    Select: function <K extends keyof T2>(...properties: K[]): LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>> {
        return LazyTable(this.query.then(Func(data => data.map(
            first => first.map(entry => omitMany(entry, properties)),
            second => merge_list_types(second.zip(data.First.map(entry =>
                pickMany(entry, properties)))))
        )))
    },

    Include: function <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: initialTable<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ): LazyTable<T1, U1, Omit<T2, K>, U2 & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }> {
        return LazyTable(this.query.then(Func(data => data.map(
            first => first.map(entry => omitOne(entry, record)),
            second => merge_list_types(second.zip(data.First.map(entry =>
                ({ [record]: q(createTable(entry[record] as any)).toList().toArray() })))) as any
        ))))
    },

    Where: function <K extends keyof U2>(key: K, predicate: Func<U2[K], boolean>): LazyTable<T1, U1, T2, U2> {
        return LazyTable(this.query.then(Func(data => data.mapRight(second => second.reduce((s, x) => {
            if (predicate.f(x[key])) {
                return Cons(x, s)
            }
            return s
        }, Empty<U2>()).reverse()))))
    },

    OrderBy: function <K extends keyof U2>(attribute: K, order: keyof Comperator<T2> = "ASC"): LazyTable<T1, U1, T2, U2> {
        return LazyTable(this.query.then(Func(data => data.mapRight(l => mergeSort(l, attribute, order)))))
    },

    apply: function (data: Data<T1, U1>): Table<T2, U2> {
        return Table(this.query.f(data))
    }
})

export const createData = <T>(list: List<T>): initialData<T> => {
    return Pair(list, createList(list.count()))
}

export const createLazyTable = <T>(): initialLazyTable<T, Unit, T, Unit> => {
    return LazyTable(Identity())
}




