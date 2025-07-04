import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Exam } from "../models/exam.model";

export interface ExamResultDto {
    student_id: number,
    exam_code: number,
    grade: number,
}

export interface ExamResult {
    student_first_name: string,
    student_last_name: string,
    student_id: number,
    exam_code: number,
    grade: number,
    accepted: boolean | null,
    professor_id?: number,
    professor_first_name?: string,
    professor_last_name?: string
}

@Injectable({ providedIn: 'root' })
export class ExamResultsService {
    private apiUrl = 'http://localhost:3000/api/examResults';

    constructor(private http: HttpClient) {}

    getResultsByStudentId(student_id: number): Observable<ExamResult[]> {
        const params = new HttpParams().set('student_id', student_id.toString());
        return this.http.get<ExamResult[]>(`${this.apiUrl}/search`, { params });
    }

    getResultsByProfessorId(professor_id: number): Observable<ExamResult[]> {
        const params = new HttpParams().set('professor_id', professor_id.toString());
        return this.http.get<ExamResult[]>(`${this.apiUrl}/search`, { params });
    }
    
    getExamResults(professor_id: number, exam_code: number): Observable<ExamResult[]> {
        const params = new HttpParams().set('professor_id', professor_id.toString()).set('exam_code', exam_code.toString());
        return this.http.get<ExamResult[]>(`${this.apiUrl}/search`, { params });
    }

    accept(student_id: number, exam_code: number, valueparam: boolean): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${student_id}/${exam_code}/accept`, { value: valueparam});
    }

    create(dto: ExamResultDto): Observable<ExamResult> {
        return this.http.post<ExamResult>(this.apiUrl, dto);
    }

}
