import { Func } from "../utils/Func";
import { Pair } from "./Pair";

/**
 * This file contains the different WHERE operators wich can be used as predicate. 
 * A predicate can consist of a Func<any, boolean>.
 * 
 */
export type WhereOperators<a> = {
    GreaterThen: (n: a) => Func<a, boolean>
    SmalletThen: (n: a) => Func<a, boolean>
    GreaterOrEquals: (n: a) => Func<a, boolean>
    SmallerOrEquals: (n: a) => Func<a, boolean>
    Equals: (a: a) => Func<a, boolean>
    Contains: (name: string) => Func<string, boolean>
    StartsWith: (name: string) => Func<string, boolean>
    EndsWith: (name: string) => Func<string, boolean>
    And: (p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>
    Or: (p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>
    Not: () => Func<boolean, boolean>
    NotEquals: (a: a) => Func<a, boolean>
}

export const WhereOperators = <a>(): WhereOperators<a> => ({
    GreaterThen: (n: a) => Func<a, boolean>(x => x > n),
    SmalletThen: (n: a) => Func<a, boolean>(x => x < n),
    SmallerOrEquals: (n: a) => Func<a, boolean>(x => x <= n),
    GreaterOrEquals: (n: a) => Func<a, boolean>(x => x >= n),
    Equals: (a: a) => Func<a, boolean>(x => x == a),
    Contains: (name: string) => Func<string, boolean>(x => x.includes(name)),
    StartsWith: (name: string) => Func<string, boolean>(x => x.startsWith(name)),
    EndsWith: (name: string) => Func<string, boolean>(x => x.endsWith(name)),
    And: (p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>(x => p1.f(x) && p2.f(x)),
    Or: (p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>(x => p1.f(x) || p2.f(x)),
    Not: () => Func<boolean, boolean>(x => !x),
    NotEquals: function (a: a) { return this.Equals(a).then(this.Not()) }
})

// .Where(f => f.get('age').GreaterThen(21).Or(x => x.get('name').Equals('Bob')))


export const GreaterThen = (n: number) => Func<number, boolean>(x => x > n)

export const SmallerThen = (n: number) => Func<number, boolean>(x => x < n)

export const GreaterOrEquals = (n: number) => Func<number, boolean>(x => x >= n)

export const SmallerOrEquals = (n: number) => Func<number, boolean>(x => x <= n)

export const Equals = <a>(selector: a) => Func<a, boolean>(x => x == selector)

export const Contains = (name: string) => Func<string, boolean>(x => x.includes(name))

export const StartsWith = (name: string) => Func<string, boolean>(x => x.startsWith(name))

export const EndsWith = (name: string) => Func<string, boolean>(x => x.endsWith(name))

export const And = <a>(p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>(x => p1.f(x) && p2.f(x))

export const Or = <a>(p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>(x => p1.f(x) || p2.f(x))

export const Not = () => Func<boolean, boolean>(x => !x)

export const NotEquals = <a>(selector: a) => Equals(selector).then(Not())

// Current sititation:
// students.Select("name", "age").Where("name", StartsWith("B"))

// Improvement: 
// students.Select("name", "age").Where(s => s.name == "Blake")


