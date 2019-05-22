export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export let omitOne = <T, K extends keyof T>(entity: T, prop: K): Omit<T, K> => {
    const { [prop]: deleted, ...newState} = entity
    return newState
}

// Refactor this into a oneliner
export let omitMany = <T, K extends keyof T>(entity: T, props: K[]): Omit<T, K> => {
    let result = entity as Omit<T, K>
    props.forEach(prop => {
        result = omitOne(result, prop as unknown as keyof Omit<T, K>) as Omit<T, K>
    })
    return result
}