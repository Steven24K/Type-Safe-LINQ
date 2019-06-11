import { Func } from "../utils/Func";
import { Table, Table2 } from "../core/Table";



export type Query<A, B, C, D> = Func<Table<A, B>, Table<C, D>>