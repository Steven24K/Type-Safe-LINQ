export type FilterBuilder<T> = {
    entity: T,
    get: <K extends keyof T>(key: K) => WhereOperator<T, T[K]>
}

type WhereOperator<T, a> = {
    entity: T,
    value: a,
    Equals: (this: WhereOperator<T, a>, comparer: a) => FilterCondition<T>
    NotEquals: (this: WhereOperator<T, a>, comparer: a) => FilterCondition<T>
    GreaterThen: (this: WhereOperator<T, a>, n: a) => FilterCondition<T>
    SmallerThen: (this: WhereOperator<T, a>, n: a) => FilterCondition<T>
    GreaterOrEquals: (this: WhereOperator<T, a>, n: a) => FilterCondition<T>
    SmallerOrEquals: (this: WhereOperator<T, a>, n: a) => FilterCondition<T>
    Between: (this: WhereOperator<T, a>, start: a, end: a) => FilterCondition<T>
    Contains: (this: WhereOperator<T, string>, name: string) => FilterCondition<T>
    StartsWith: (this: WhereOperator<T, string>, name: string) => FilterCondition<T>
    EndsWith: (this: WhereOperator<T, string>, name: string) => FilterCondition<T>
} 


export type FilterCondition<T> = {
    entity: T,
    condition: boolean,
    And: (f: (_: FilterBuilder<T>) => FilterCondition<T>) => FilterCondition<T>
    Or: (f: (_: FilterBuilder<T>) => FilterCondition<T>) => FilterCondition<T>
    Not: () => FilterCondition<T>
}



export const FilterBuilder = <T>(entity: T): FilterBuilder<T> => ({
    entity: entity,
    get: function <K extends keyof T>(key: K): WhereOperator<T, T[K]> {
            return WhereOperator(this.entity,  entity[key])
    }
})

const WhereOperator = <T, a>(e: T, v: a): WhereOperator<T, a> => ({
    entity: e,
    value: v,
    Equals: function (this: WhereOperator<T, a> ,comparer: a): FilterCondition<T> {
        return FilterCondition(this.entity, comparer == this.value)
    },
    NotEquals: function (this: WhereOperator<T, a>, comparer: a): FilterCondition<T> {
        return FilterCondition(this.entity, comparer != this.value)
    },
    GreaterOrEquals: function (this: WhereOperator<T, a>, n: a): FilterCondition<T> {
        return FilterCondition(this.entity, this.value >= n)
    },
    GreaterThen: function (this: WhereOperator<T, a>, n: a): FilterCondition<T> {
        return FilterCondition(this.entity, this.value > n)
    },
    SmallerOrEquals: function (this: WhereOperator<T, a>, n: a): FilterCondition<T> {
        return FilterCondition(this.entity, this.value <= n)
    },
    SmallerThen: function (this: WhereOperator<T, a>, n: a): FilterCondition<T> {
        return FilterCondition(this.entity, this.value < n)
    },
    Between: function (this: WhereOperator<T, a>, start: a, end: a): FilterCondition<T> {
        return FilterCondition(this.entity, this.value > start && this.value < end)
    },
    Contains: function (this: WhereOperator<T, string>, name: string): FilterCondition<T> {
        return FilterCondition(this.entity, this.value.includes(name))
    },
    EndsWith: function (this: WhereOperator<T, string>, name: string): FilterCondition<T> {
        return FilterCondition(this.entity, this.value.endsWith(name))
    },
    StartsWith: function (this: WhereOperator<T, string>, name: string): FilterCondition<T> {
        return FilterCondition(this.entity, this.value.startsWith(name))
    }
})


const FilterCondition = <T>(e: T, cond: boolean): FilterCondition<T> => ({
    entity: e,
    condition: cond,
    And: function (f: (_: FilterBuilder<T>) => FilterCondition<T>): FilterCondition<T> {
        let second_condition = f(FilterBuilder(this.entity)).condition
        return FilterCondition(this.entity, this.condition && second_condition)
    },
    Or: function (f: (_: FilterBuilder<T>) => FilterCondition<T>): FilterCondition<T> {
        let second_condition = f(FilterBuilder(this.entity)).condition
        return FilterCondition(this.entity, this.condition || second_condition)
    },
    Not: function (): FilterCondition<T> { return FilterCondition(this.entity, !this.condition)}
})

