import { Table } from "./Table";

export type Filterable<T, U> = {
    Where: (predicate: (_: keyof U) => boolean) => Table<T, U>
}