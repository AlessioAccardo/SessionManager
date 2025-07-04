export class ExamCourse {
    constructor(
        public exam_code: string,
        public student_id: number,
        public grade: number,
        public accepted: boolean
    ){}
}