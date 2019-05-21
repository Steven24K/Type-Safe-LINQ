import { Table } from "./Table";
import { Omit } from "../utils/Omit";

export type Selectable<T, U> =  {
    Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>
}