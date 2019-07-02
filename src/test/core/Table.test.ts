import { createTable } from "../../core/Table";
import { ListFromArray } from "../../core/List";
import { Student } from "../../models/Student";
import { Course } from "../../models/Course";


let table = createTable(
    ListFromArray(
        [
            Student(
                'Steven',
                'Koerts',
                21, 
                'male',
                ListFromArray(
                    [
                        Course('Software Engineering', 9, 30),
                        Course('Internship', 7, 29),
                        Course('SLC', 10, 1),
                        Course('Development 8', 8, 4),
                        Course('Analysis 7', 7.5, 3),
                    ]
                )
            ),
        ]
    ))



test(`test Table.Select`, () => {
    let query = table.Select('name', 'age', 'gender')
    let result = [
        {
            name: 'Steven',
            age: 21,
            gender: 'male'
        }
    ]

    expect(query.toList().toArray()).toEqual(result)
})

test(`test Table.Include`, () => {
    let query = table.Select('name', 'surname').Include('Courses', q => q.Select('grade', 'name'))
    let result = [
        {
            name: 'Steven',
            surname: 'Koerts',
            Courses: [
                {
                    grade: 9,
                    name: 'Software Engineering'
                },
                {
                    grade: 7,
                    name: 'Internship'
                },
                {
                    grade: 10,
                    name: 'SLC'
                },
                {
                    grade: 8,
                    name: 'Development 8'
                },
                {
                    grade: 7.5,
                    name: 'Analysis 7'
                },
            ]
        }
    ]

    expect(query.toList().toArray()).toEqual(result)
})

test(`test Table.Where`, () => {
    let query = table.Where(f => f.get('age').Equals(21))
        .Select('name', 'age')
        .Include('Courses', q =>
            q.Where(f => f.get('grade').GreaterOrEquals(9))
                .Select('grade', 'name')
        )

    let result = [
        {
            name: 'Steven',
            age: 21,
            Courses: [
                {
                    grade: 9,
                    name: 'Software Engineering'
                },
                {
                    grade: 10,
                    name: 'SLC'
                },
            ]
        },
    ]

    expect(query.toList().toArray()).toEqual(result)
})


test(`test Table.OrderBy`, () => {
    let query = table.Select('name').Include('Courses', q => q.OrderBy('grade', 'ASC').Select('grade', 'name'))
    let result = [
        {
            name: 'Steven',
            Courses: [
                {
                    grade: 10,
                    name: 'SLC'
                },
                {
                    grade: 9,
                    name: 'Software Engineering'
                },
                {
                    grade: 8,
                    name: 'Development 8'
                },
                {
                    grade: 7.5,
                    name: 'Analysis 7'
                },
                {
                    grade: 7,
                    name: 'Internship'
                },
            ]
        }
    ]

    expect(query.toList().toArray()).toEqual(result)
})
