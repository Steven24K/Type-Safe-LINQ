import { Filter } from "../utils/PickIf";
import { List } from "./List";
import { ListType } from "../utils/ListType";
import { Unit } from "../utils/Unit";
import { Table } from "./Table";
import { Omit } from "../utils/Omit";
import { Pair } from "./Pair";


export type IncludeAble<T , U> = {
    Include: <R extends Filter<T, List<any>>, P extends keyof ListType<T[R]>>(
        record: R,
        q: (_: Table<ListType<T[R]>, Unit>) => Table<Omit<ListType<T[R]>, P>, Pick<ListType<T[R]>, P>>
    ) =>
        Table<Omit<T, R>, U & { [r in R]: List<Pick<ListType<T[R]>, P>> }>
    //Table<{ The untouched set + the included values }, {name: string, Grades: [{ courseId: string, grade: number }]}>

}

export let Includeable = <T, U>(data: Pair<List<T>, List<U>>): IncludeAble<T, U> => ({
    Include: function<R extends Filter<T, List<any>>, P extends keyof ListType<T[R]>>(
        record: R,
        q: (_: Table<ListType<T[R]>, Unit>) => Table<Omit<ListType<T[R]>, P>, Pick<ListType<T[R]>, P>>
    ): 
        Table<Omit<T, R>, U & { [r in R]: List<Pick<ListType<T[R]>, P>> }> {
            return null!
        }
})