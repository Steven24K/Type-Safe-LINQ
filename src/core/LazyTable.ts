import { Func, Identity } from "../utils/Func";
import { Omit, omitMany } from "../utils/Omit";
import { merge_list_types, List } from "./List";
import { pickMany } from "../utils/Pick";
import { Unit } from "../types/Unit";
import { Filter } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Comperator } from "../utils/Comperator";
import { Table } from "./Table";
import { Query } from "../types/Query";
import { FilterBuilder, FilterCondition } from "./FilterBuilder";


// type initialLazyTable<T> = {
//     query: Query<T, Unit, T, Unit>

//     Select: <K extends keyof T>(...properties: K[]) => LazyTable<T, Unit, Omit<T, K>, Pick<T, K>>
// }

// const initialLazyTable = <T>(q: Query<T, Unit, T, Unit>): initialLazyTable<T> => ({
//     query: q,

//     Select: function <K extends keyof T>(...properties: K[]): LazyTable<T, Unit, Omit<T, K>, Pick<T, K>> {
//         return LazyTable(this.query.then(Func(table => Table(table.data.map(
//             first => first.map(entry => omitMany(entry, properties)),
//             second => merge_list_types(second.zip(table.data.First.map(entry => pickMany(entry, properties))))
//         )))))
//     },
// })


interface LazyTable<T1, U1, T2, U2> {
    query: Query<T1, U1, T2, U2>

    Select: <K extends keyof T2>(...properties: K[]) => LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>>

    Include: <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: Table<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ) => LazyTable<T1, U1, Omit<T2, K>, U2 & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }>

    Where: (filter: (_: FilterBuilder<U2>) => FilterCondition<U2>) => LazyTable<T1, U1, T2, U2>

    OrderBy: <K extends keyof U2>(attribute: K, order?: keyof Comperator<T2>) => LazyTable<T1, U1, T2, U2>

    apply: (data: Table<T1, U1>) => Table<T2, U2>
}

const LazyTable = <T1, U1, T2, U2>(q: Query<T1, U1, T2, U2>): LazyTable<T1, U1, T2, U2> => ({
    query: q,

    Select: function <K extends keyof T2>(...properties: K[]): LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>> {
        return LazyTable(this.query.then(Func(table => table.Select(...properties))))
    },

    Include: function <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: Table<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ): LazyTable<T1, U1, Omit<T2, K>, U2 & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }> {
        return LazyTable(this.query.then(Func(table => table.Include(record, q))))
    },

    Where: function (filter: (_: FilterBuilder<U2>) => FilterCondition<U2>): LazyTable<T1, U1, T2, U2> {
        return LazyTable(this.query.then(Func(table => table.Where(filter))))
    },

    OrderBy: function <K extends keyof U2>(attribute: K, order: keyof Comperator<T2> = "ASC"): LazyTable<T1, U1, T2, U2> {
        return LazyTable(this.query.then(Func(table => table.OrderBy(attribute, order))))
    },

    apply: function (data: Table<T1, U1>): Table<T2, U2> {
        return this.query.f(data)
    }
})


export const createLazyTable = <T>(): LazyTable<T, Unit, T, Unit> => {
    return LazyTable(Identity())
}




