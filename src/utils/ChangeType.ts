export type ChangeType<Of, To, Where extends keyof Of> = {
    [K in keyof Of]: K extends Where ? To : Of[K]
}
