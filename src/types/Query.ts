import { Func } from "../utils/Func";
import { Table, initialTable } from "../core/Table";


export type Query<A, B, C> = Func<initialTable<A>, Table<B, C>>