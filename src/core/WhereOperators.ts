import { Func } from "../utils/Func";
import { Pair } from "./Pair";

/**
 * This file contains the different WHERE operators wich can be used as predicate. 
 * A predicate can consist of a Func<any, boolean>.
 * 
 */


export const GreaterThen = (n: number) => Func<number, boolean>(x => x > n)

export const SmallerThen = (n: number) => Func<number, boolean>(x => x < n)

export const GreaterOrEquals = (n: number) => Func<number, boolean>(x => x >= n)

export const SmallerOrEquals = (n: number) => Func<number, boolean>(x => x <= n)

export const Equals = <a>(selector: a) => Func<a, boolean>(x => x == selector)

export const Like = (name: string) => Func<string, boolean>(x => x.includes(name))

export const StartsWith = (name: string) => Func<string ,boolean>(x => x.startsWith(name))

export const EndsWith = (name: string) => Func<string ,boolean>(x => x.endsWith(name))

export const And = <a>(p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>(x => p1.f(x) && p2.f(x))

export const Or = <a>(p1: Func<a, boolean>, p2: Func<a, boolean>) => Func<a, boolean>(x => p1.f(x) || p2.f(x))

export const Not = () => Func<boolean, boolean>(x => !x)

export const NotEquals = <a>(selector: a) => Equals(selector).then(Not())
// Current sititation:
// students.Select("name", "age").Where("name", StartsWith("B"))

// Improvement: 
// students.Select("name", "age").Where(s => s.name == "Blake")


