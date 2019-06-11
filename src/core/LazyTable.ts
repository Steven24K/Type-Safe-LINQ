import { Func, Identity } from "../utils/Func";
import { Omit } from "../utils/Omit";
import { List } from "./List";
import { Unit } from "../types/Unit";
import { Filter } from "../types/PickIf";
import { ListType } from "../types/ListType";
import { Comperator } from "../utils/Comperator";
import { Table, initialTable } from "./Table";
import { Query } from "../types/Query";
import { FilterBuilder, FilterCondition } from "./FilterBuilder";


interface initialLazyTable<T1, U1, T2, U2> {
    query: Query<T1, U1, T2, U2>

    Select: <K extends keyof T2>(...properties: K[]) => LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>>
}


interface LazyTable<T1, U1, T2, U2> {
    query: Query<T1, U1, T2, U2>

    Select: <K extends keyof T2>(...properties: K[]) => LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>>

    Include: <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: initialTable<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
    ) => LazyTable<T1, U1, Omit<T2, K>, U2 & { [key in K]: Array<Pick<ListType<T2[K]>, P>> }>

    Where: (filter: (_: FilterBuilder<U2>) => FilterCondition<U2>) => LazyTable<T1, U1, T2, U2>

    OrderBy: <K extends keyof U2>(attribute: K, order?: keyof Comperator<T2>) => LazyTable<T1, U1, T2, U2>

    apply: (data: Table<T1, U1>) => Table<T2, U2>
}

const initialLazyTable = <T1, U1, T2, U2>(q: Query<T1, U1, T2, U2>): initialLazyTable<T1, U1, T2, U2> => ({
    query: q,

    Select: function <K extends keyof T2>(...properties: K[]): LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>> {
        return LazyTable(this.query.then(Func(table => table.Select(...properties))))
    },
})

const LazyTable = <T1, U1, T2, U2>(q: Query<T1, U1, T2, U2>): LazyTable<T1, U1, T2, U2> => ({
    query: q,

    Select: function <K extends keyof T2>(...properties: K[]): LazyTable<T1, U1, Omit<T2, K>, U2 & Pick<T2, K>> {
        return LazyTable(this.query.then(Func(table => table.Select(...properties))))
    },

    Include: function <K extends Filter<T2, List<any>>, P extends keyof ListType<T2[K]>>(
        record: K,
        q: (_: initialTable<ListType<T2[K]>, Unit>) => Table<Omit<ListType<T2[K]>, P>, Pick<ListType<T2[K]>, P>>
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


export const createLazyTable = <T>(): initialLazyTable<T, Unit, T, Unit> => {
    return LazyTable(Identity())
}




