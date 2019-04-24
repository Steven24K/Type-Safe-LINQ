export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export let omitOne = <T, K extends keyof T>(entity: T, props: K): Omit<T, K> => {
    return delete entity[props], entity
}

export let omitMany = <T, K extends keyof T>(entity: T, props: K[]): Omit<T, K> => {
    return props.reduce((s, prop) => (delete s[prop] ,s), entity)
}


//omitMany(student1, ["name", "age", "email"])