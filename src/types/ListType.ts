import { List } from "../core/List";

export type ListType<T> = T extends List<infer U> ? U : never;