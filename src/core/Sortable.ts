import { Table } from "./Table";

export type Sortable<T, U> = {
    OrderBy: (attribute: keyof U, order: "ASC" | "DESC") => Table<T, U>
}