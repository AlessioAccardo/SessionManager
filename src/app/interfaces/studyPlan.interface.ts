export interface StudyPlan {
    student_id: number,
    course_id: number,
    grade: number | null,
    course_name: string,
    credits: number,
    student_first_name: string,
    student_last_name: string,
    professor_id: number,
    professor_first_name: string,
    professor_last_name: string
};