import { List, Cons, Empty } from "../../core/List";
import { mergeSort } from "../../utils/mergeSort";

type TestType = { a: string, b: number }

let list: List<TestType> = Cons({ a: "g", b: 5 },
    Cons({ a: "t", b: 53 },
        Cons({ a: "r", b: 4 },
            Cons({ a: "d", b: 7 },
                Cons({ a: "a", b: 28 },
                    Cons({ a: "m", b: 633 },
                        Cons({ a: "j", b: 59 },
                            Cons({ a: "c", b: 12 }, Empty()))))))))

let list_sorted_by_a_asc: List<TestType> = Cons({ a: "a", b: 28 },
    Cons({ a: "c", b: 12 },
        Cons({ a: "d", b: 7 },
            Cons({ a: "g", b: 5 },
                Cons({ a: "j", b: 59 },
                    Cons({ a: "m", b: 633 },
                        Cons({ a: "r", b: 4 },
                            Cons({ a: "t", b: 53 }, Empty()))))))))

let list_sorted_by_a_desc: List<TestType> = Cons({ a: "t", b: 53 },
    Cons({ a: "r", b: 4 },
        Cons({ a: "m", b: 633 },
            Cons({ a: "j", b: 59 },
                Cons({ a: "g", b: 5 },
                    Cons({ a: "d", b: 7 },
                        Cons({ a: "c", b: 12 },
                            Cons({ a: "a", b: 28 }, Empty()))))))))


test(`mergeSort sort by string`, () => {
    expect(JSON.stringify(mergeSort(list, "a", "ASC")))
        .toEqual(JSON.stringify(list_sorted_by_a_asc))

    expect(JSON.stringify(mergeSort(list, "a", "DESC")))
        .toEqual(JSON.stringify(list_sorted_by_a_desc))
})

let list_sorted_by_b_asc: List<TestType> = Cons({ a: "r", b: 4 },
    Cons({ a: "g", b: 5 },
        Cons({ a: "d", b: 7 },
            Cons({ a: "c", b: 12 },
                Cons({ a: "a", b: 28 },
                    Cons({ a: "t", b: 53 },
                        Cons({ a: "j", b: 59 },
                            Cons({ a: "m", b: 633 }, Empty()))))))))

let list_sorted_by_b_desc: List<TestType> = Cons({ a: "m", b: 633 },
    Cons({ a: "j", b: 59 },
        Cons({ a: "t", b: 53 },
            Cons({ a: "a", b: 28 },
                Cons({ a: "c", b: 12 },
                    Cons({ a: "d", b: 7 },
                        Cons({ a: "g", b: 5 },
                            Cons({ a: "r", b: 4 }, Empty()))))))))

test(`mergeSort sort by number`, () => {
    expect(JSON.stringify(mergeSort(list, "b", "ASC")))
        .toEqual(JSON.stringify(list_sorted_by_b_asc))

    expect(JSON.stringify(mergeSort(list, "b", "DESC")))
        .toEqual(JSON.stringify(list_sorted_by_b_desc))

})