import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface EnrolledStudentDto {
    student_id: number,
    exam_code: number
}

export interface EnrolledStudent {
    student_first_name: string,
    student_last_name: string,
    student_id: number,
    exam_code: number,
    exam_name: string,
    credits: number,
    enrolled_students: number,
    professor_id: number,
    date: string,
    course_id: number,
    professor_first_name: string,
    professor_last_name: string
}

@Injectable({ providedIn: 'root' })
export class EnrolledStudentsService {
    private apiUrl = 'http://localhost:3000/api/enrolledStudents';

    constructor(private http: HttpClient) {}

    unenrollStudent(student_id: number, exam_code: number): Observable<void> {
        const params = new HttpParams().set('student_id', student_id).set('exam_code', exam_code);
        return this.http.delete<void>(`${this.apiUrl}/unenroll`, { params });
    }

    enrollStudent(dto: EnrolledStudentDto): Observable<EnrolledStudentDto> {
        return this.http.post<EnrolledStudentDto>(`${this.apiUrl}/enroll`, dto);
    }

    getAll(): Observable<EnrolledStudent[]> {
        return this.http.get<EnrolledStudent[]>(this.apiUrl);
    }

    getExamsByEnrolledStudent(student_id: number): Observable<EnrolledStudent[]> {
        return this.http.get<EnrolledStudent[]>(`${this.apiUrl}/student/${student_id}`);
    }

    getEnrolledStudentsByExam(exam_code: number): Observable<EnrolledStudent[]> {
        return this.http.get<EnrolledStudent[]>(`${this.apiUrl}/exam/${exam_code}`);
    }
}