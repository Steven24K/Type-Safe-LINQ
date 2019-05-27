import { List, Cons } from "../core/List";
import { Comperator } from "./Comperator";



// support method for OrderBy, using mergeSort
const merge = <T>(l1: List<T>, l2: List<T>, property: keyof T, order: keyof Comperator<T>): List<T> => {
    if (l1.Kind == "Empty") {
        return l2
    } else if (l2.Kind == "Empty") {
        return l1
    } else {
        if (Comperator(l2.Head[property])[order].f(l1.Head[property])) {
            return Cons(l1.Head, merge(l1.Tail, l2, property, order))
        } else {
            return Cons(l2.Head, merge(l1, l2.Tail, property, order))
        }
    }
}

export const mergeSort = <T>(list: List<T>, property: keyof T, order: keyof Comperator<T>): List<T> => {
    let size = list.count()
    if (size == 1) {
        return list
    } else {
        let middle = Math.floor(size / 2 -1)
        let p = list.splitAt(middle)
        let left = mergeSort(p.First, property, order)
        let right = mergeSort(p.Second, property, order)
        return merge(left, right, property, order)
    }
}