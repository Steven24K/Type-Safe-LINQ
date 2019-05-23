import { IdentityLambda } from "../../utils/IdentityLambda";

test(`Test the Identity Lamda`, () => {
    expect(IdentityLambda()(3)).toBe(3)
})