export interface Course {
    name: string
    grade: number
    studypoints: number
}

export const Course = (
    name: string,
    grade: number,
    studypoints: number
): Course => ({
    name: name,
    grade: grade,
    studypoints: studypoints
})