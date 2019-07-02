import { Func, Identity } from "../utils/Func";
import { Omit } from "../utils/Omit";
import { List } from "./List";
import { Unit } from "../types/Unit";
import { Filter } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Comperator } from "../utils/Comperator";
import { Table } from "./Table";
import { Query } from "../types/Query";
import { FilterBuilder, FilterCondition } from "./FilterBuilder";



interface LazyTable<T1, T2, U> {
    query: Query<T1, T2, U>

    Select: <K extends keyof T2>(...properties: K[]) => LazyTable<T1, Omit<T2, K>, U & Pick<T2, K>>

    Include: <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: Table<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ) => LazyTable<T1, Omit<T2, K>, U & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }>

    Where: (filter: (_: FilterBuilder<T2>) => FilterCondition<T2>) => LazyTable<T1, T2, U>

    OrderBy: <K extends keyof T2>(attribute: K, order?: keyof Comperator<T2>) => LazyTable<T1, T2, U>

    apply: (data: Table<T1, Unit>) => Table<T2, U>
}



const LazyTable = <T1, T2, U>(q: Query<T1, T2, U>): LazyTable<T1, T2, U> => ({
    query: q,

    Select: function <K extends keyof T2>(...properties: K[]): LazyTable<T1, Omit<T2, K>, U & Pick<T2, K>> {
        return LazyTable(this.query.then(Func(table => table.Select(...properties))))
    },

    Include: function <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: Table<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ): LazyTable<T1, Omit<T2, K>, U & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }> {
        return LazyTable(this.query.then(Func(table => table.Include(record, q))))
    },

    Where: function (filter: (_: FilterBuilder<T2>) => FilterCondition<T2>): LazyTable<T1, T2, U> {
        return LazyTable(this.query.then(Func(table => table.Where(filter))))
    },

    OrderBy: function <K extends keyof T2>(attribute: K, order: keyof Comperator<T2> = "ASC"): LazyTable<T1, T2, U> {
        return LazyTable(this.query.then(Func(table => table.OrderBy(attribute, order))))
    },

    apply: function (data: Table<T1, Unit>): Table<T2, U> {
        return this.query.f(data)
    }
})


export const createLazyTable = <T>(): LazyTable<T, T, Unit> => {
    return LazyTable(Func(initTable => Table(initTable.data)))
}




