export interface Grade {
    courseId: string
    grade: number
    studentId: number
}

/*
The relationsship between Grade and Student is as follows: 

Student
id | name | surname | age | email


Grade
courseId | studentId | grade 
*/