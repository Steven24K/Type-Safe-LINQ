import { Func } from "../utils/Func";
import { Table } from "../core/Table";


export type Query<A, B, C, D> = Func<Table<A, B>, Table<C, D>>