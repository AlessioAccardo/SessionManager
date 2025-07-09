export interface ExamResult {
    student_first_name: string,
    student_last_name: string,
    student_id: number,
    exam_code: number,
    grade: number,
    accepted: boolean | null,
    professor_id: number,
    professor_first_name: string,
    professor_last_name: string,
    course_id: number,
    course_name: string,
    course_credits: number
};