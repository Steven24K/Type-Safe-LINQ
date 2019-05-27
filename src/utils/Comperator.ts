import { Func } from "./Func";

// ASC and DESC operators for Table.OrderBy
// Signatures are the same only the implementations are different
export type Comperator<T> = {
    ASC: Func<T, boolean>
    DESC: Func<T, boolean>
}

export const Comperator = <T>(comparer: T): Comperator<T> => ({
    ASC: Func<T, boolean>(x => x <= comparer),
    DESC: Func<T, boolean>(x => comparer <= x)
})