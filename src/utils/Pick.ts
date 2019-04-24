export let pickOne = <T, K extends keyof T>(entity: T, props: K ): Pick<T, K> => {
    return { [props] : entity[props] } as Pick<T, K>
}

export let pickMany = <T, K extends keyof T>(entity: T, props: K[]) => {
   return props.reduce((s, prop) => (s[prop] = entity[prop], s) , {} as Pick<T, K>)
}


//pickMany(student1, ["name", "surname"])