export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export let omitOne = <T, K extends keyof T>(entity: T, prop: K): Omit<T, K> => {
    const { [prop]: deleted, ...newState} = entity
    return newState
}

// Refactor this into a oneliner
export let omitMany = <T, K extends keyof T>(entity: T, props: K[]): Omit<T, K> => {
    let result = entity as Omit<T, K>
    for (let prop in props) {
        result = omitOne(entity, prop as K)
    }
    return result
}


//omitMany(student1, ["name", "age", "email"])