import { Func } from "../utils/Func";
import { Table } from "../core/Table";
import { Unit } from "./Unit";


export type Query<A, B, C> = Func<Table<A, Unit>, Table<B, C>>