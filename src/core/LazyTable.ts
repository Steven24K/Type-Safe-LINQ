import { Func, Identity } from "../utils/Func";
import { Omit } from "../utils/Omit";
import { List } from "./List";
import { Unit } from "../types/Unit";
import { Filter, PickIf } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Comperator } from "../utils/Comperator";
import { Table, initialTable } from "./Table";
import { Query } from "../types/Query";
import { FilterBuilder, FilterCondition } from "./FilterBuilder";


interface initialLazyTable<T> {
    query: Query<T, T, Unit>

    Select: <K extends keyof T>(...properties: K[]) => LazyTable<T, Omit<T, K>, Pick<T, K>>
}


interface LazyTable<T1, T2, U> {
    query: Query<T1, T2, U>

    Select: <K extends keyof T2>(...properties: K[]) => LazyTable<T1, Omit<T2, K>, U & Pick<T2, K>>

    Include: <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: initialTable<ListType<T2[K]>>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ) => LazyTable<T1, Omit<T2, K>, U & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }>

    Where: (filter: (_: FilterBuilder<PickIf<T2 & U, string | number | boolean>>) => FilterCondition<PickIf<T2 & U, string | number | boolean>>) => LazyTable<T1, T2, U>

    OrderBy: <K extends keyof U>(attribute: K, order?: keyof Comperator<T2>) => LazyTable<T1, T2, U>

    apply: (data: initialTable<T1>) => Table<T2, U>
}

const initialLazyTable = <T>(q: Query<T, T, Unit>): initialLazyTable<T> => ({
    query: q,

    Select: function <K extends keyof T>(...properties: K[]): LazyTable<T, Omit<T, K>, Pick<T, K>> {
        return LazyTable(this.query.then(Func(table => table.Select(...properties))))
    },
})

const LazyTable = <T1, T2, U>(q: Query<T1, T2, U>): LazyTable<T1, T2, U> => ({
    query: q,

    Select: function <K extends keyof T2>(...properties: K[]): LazyTable<T1, Omit<T2, K>, U & Pick<T2, K>> {
        return LazyTable(this.query.then(Func(table => table.Select(...properties))))
    },

    Include: function <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: initialTable<ListType<T2[K]>>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ): LazyTable<T1, Omit<T2, K>, U & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }> {
        return LazyTable(this.query.then(Func(table => table.Include(record, q))))
    },

    Where: function (filter: (_: FilterBuilder<PickIf<T2 & U, string | number | boolean>>) => FilterCondition<PickIf<T2 & U, string | number | boolean>>): LazyTable<T1, T2, U> {
        return LazyTable(this.query.then(Func(table => table.Where(filter))))
    },

    OrderBy: function <K extends keyof U>(attribute: K, order: keyof Comperator<T2> = "ASC"): LazyTable<T1, T2, U> {
        return LazyTable(this.query.then(Func(table => table.OrderBy(attribute, order))))
    },

    apply: function (data: initialTable<T1>): Table<T2, U> {
        return this.query.f(data)
    }
})


export const createLazyTable = <T>(): initialLazyTable<T> => {
    return LazyTable(Func(initTable => Table(initTable.data)))
}




