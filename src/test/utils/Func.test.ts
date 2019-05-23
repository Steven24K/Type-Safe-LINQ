import { Func, Identity } from "../../utils/Func";

let incr = Func<number, number>(x => x + 1)
let double_incr = incr.then(incr)
let repeat_incr = (n: number) => incr.repeat().f(n)
let is_even = Func<number ,boolean>(x => x % 2 == 0)
let incr_until_even = incr.repeatUntil().f(is_even)

test(`Func test: Excecution, composition and loops`, () => {
    expect(incr.f(3)).toBe(4)
    expect(double_incr.f(3)).toBe(5)
    expect(repeat_incr(5).f(3)).toBe(8)
    expect(is_even.f(3)).toBe(false)
    expect(incr_until_even.f(3)).toBe(4)
})

test(`Test the Identity Func`, () => {
    expect(Identity().f(3)).toBe(3)
})