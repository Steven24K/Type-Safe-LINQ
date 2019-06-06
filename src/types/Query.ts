import { Func } from "../utils/Func";
import { Data } from "./Data";

export type Query<A, B, C, D> = Func<Data<A, B>, Data<C, D>>