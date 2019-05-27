import { Comperator } from "../../utils/Comperator";

test(`Comperator test for Table.OrderBy operator and List.sort`, () => {
    expect(Comperator(4)["ASC"].f(8)).toBe(false)
    expect(Comperator(4)["DESC"].f(8)).toBe(true)
})