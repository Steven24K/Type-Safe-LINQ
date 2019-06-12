# Type-Safe-LINQ
This is a school project for the Software Engineering minor at Hogeschool Rotterdam. See the project description here [description](https://github.com/hogeschool/Software-Engineering-Minor/blob/master/Projects/project2%20-%20mini%20typesafe%20LINQ%20to%20SQL.md)

The purpose is to build a type safe LINQ library using Typescript, with full blown type safety. The framework assumes that you have allready gathered the data, from an in memory database or an externall API. It can map existing objects to new filtered and sorted objects. 

This is an example of code: 
```
students.Select('name', 'age', 'gender')
    .Include('Courses', q =>
        q.Select('grade', 'name')
            .Where(f =>
                f.get('grade').GreaterOrEquals(5.5)
                    .And(f =>
                        f.get('name').In(['Software Engineering', 'Development 8', 'Project 7/8'])))
            .OrderBy('grade', 'DESC'))
    .Where(f =>
        f.get('name').Between('A', 'M')
            .And(f =>
                f.get('age').GreaterOrEquals(21)))
    .OrderBy('age', 'DESC')
```

## Dependencies 
The only depencies for this project are: 
- Node.js (11.2.0)
- Typescript V3.4.3
- Jest V24.8 (For unit testing)

## How to install
The instalation procedure for this project is rather simple, after your finished you can start right away with building and experimenting. 

1. Clone the the repository `git clone https://github.com/Steven24K/Type-Safe-LINQ.git`
2. Open the folder in your favorite editor(I like to use VSCode) and run `npm install` from the root
3. Run `npm run watch` to compile the project in watch mode or just run `npm run build` to compile only once
4. With `npm run start` you can run the compiled Javascript files in the build folder, the *main.ts* file is the entry point for the application
5. `run npm test` to run the unit tests in the test folder, to see if everything works well.
6. After these stepps you are good to go and start developping


## Usage of the framework

The framework works by performing the operations on a `Table`, this object contains the data and the operations. 
The data is in the shape of a custom build LinkedList.

start by creating a table: `createTable(list: List<Student>) => initialTable<Student>`
*The initialTable only contains the `Select` operator.*

**Select**
Takes some properties from the object and returns a new Table containing the Selected properties. It is possible to call multiple Select operators as a chain: `.Select('name').Select('surname')`
```
Select: <K extends keyof T>(this: Table<T, U>, ...properties: K[]) => Table<Omit<T, K>, Pick<T, K> & U>
```

**Include**
Perfoms a query on a inner set inside the orginal object. 
```
    Include: <K extends Filter<T, List<any>>, P extends keyof ListType<T[K]>>(
        record: K,
        q: (_: initialTable<ListType<T[K]>>) => Table<Omit<ListType<T[K]>, P>, Pick<ListType<T[K]>, P>>
    ) =>
        Table<Omit<T, K>, U & { [key in K]: Array<Pick<ListType<T[K]>, P>> }>
```

**Where**
Filters the Table according to a given condition, the Where operator takes a FilterBuilder as parameter. This builds a chain of different Where operators, to produce the final condition. The syntax is miroring the SQL syntax of the WHERE clause. 
`filter => filter.get('name').Equals('Peter').Or(filter => filter.get('age').GreaterThen(21))`
The Where does not change the type of the Table.
```
Where: (filter: (_: FilterBuilder<U>) => FilterCondition<U>) => Table<T, U>
```

**OrderBy**
Sorts the Table in ascending or descending order. 
```
OrderBy: <K extends keyof U>(attribute: K, order?: keyof Comperator<T>) => Table<T, U>
```

**toList**
Returns the final result of the Table as a List.  
```
toList: (this: Table<T, U>) => List<U>
```


## LazyTable
The `LazyTable` contains the same operations as the `Table`, but the difference is that te `LazyTable` does not contain any data. The LazyTable only contains a query wich can be aplied to a `Table` and called when necessary. The methods of the LazyTable return a chain of executable functions, the final result of a query can be a function from `initialTable<A> => Table<B>`

```
createLazyTable<Student>().Select('name').apply(students)
```





