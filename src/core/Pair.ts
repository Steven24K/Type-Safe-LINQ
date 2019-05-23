import { IdentityLambda } from "../utils/IdentityLambda";


interface PairType<T, U> {
    First: T,
    Second: U
}

interface PairOperations<T, U> {
    map: <TResult, UResult>(this: Pair<T, U>, f: (_: T) => TResult, g: (_: U) => UResult) => Pair<TResult, UResult>
    mapLeft: <TResult>(this: Pair<T, U>, f: (_: T) => TResult) => Pair<TResult, U>
    mapRight: <UResult>(this: Pair<T, U>, g: (_: U) => UResult) => Pair<T, UResult>
}

export type Pair<T, U> = PairType<T, U> & PairOperations<T, U>

export const Pair = <T, U>(first: T, second: U): Pair<T, U> => ({
    First: first,
    Second: second,
    map: function <TResult, UResult>(this: Pair<T, U>, f: (_: T) => TResult, g: (_: U) => UResult): Pair<TResult, UResult>{
        return Pair(f(this.First), g(this.Second))
    },
    mapLeft: function <TResult>(this: Pair<T, U>, f: (_: T) => TResult): Pair<TResult, U> {
        return this.map(f, IdentityLambda())
    },
    mapRight: function  <UResult>(this: Pair<T, U>, g: (_: U) => UResult): Pair<T, UResult> {
        return this.map(IdentityLambda(), g)
    }
})