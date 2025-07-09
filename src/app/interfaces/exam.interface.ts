export interface Exam {
    code: number,
    name: string,
    credits: number,
    enrolled_students: number,
    professor_id: number,
    approved?: boolean | null,
    date: string,
    course_id: number,
    professor_first_name?: string,
    professor_last_name?: string,
};