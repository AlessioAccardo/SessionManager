import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";
import { ExamResult } from "../interfaces/examResult.interface";
import { ExamResultDto } from "../interfaces/examResultDto.interface";

@Injectable({ providedIn: 'root' })
export class ExamResultsService {
    private apiUrl;

    constructor(private http: HttpClient) {
      if (Capacitor.getPlatform() === 'web') {
      this.apiUrl = 'http://localhost:3000/api/examResults';
    }
    // simulator Android
    else if (Capacitor.getPlatform() === 'android') {
      this.apiUrl = 'http://10.0.2.2:3000/api/examResults';
    }
    // simulator iOS
    else if (Capacitor.getPlatform() === 'ios') {
      this.apiUrl = 'http://localhost:3000/api/examResults';
    }
    // device fisico in live‑reload
    else {
      const ip = window.location.hostname;
      this.apiUrl = `http://${ip}:3000/api/examResults`;
    }
    }

    getResultsByStudentId(student_id: number): Observable<ExamResult[]> {
        const params = new HttpParams().set('student_id', student_id.toString());
        return this.http.get<ExamResult[]>(`${this.apiUrl}/search`, { params });
    }

    getResultsGroupedByProfessor(): Observable<ExamResult[]> {
        return this.http.get<ExamResult[]>(`${this.apiUrl}/grouped`);
    }
    
    getExamResults(professor_id: number, exam_code: number): Observable<ExamResult[]> {
        const params = new HttpParams().set('professor_id', professor_id.toString()).set('exam_code', exam_code.toString());
        return this.http.get<ExamResult[]>(`${this.apiUrl}/search`, { params });
    }

    getExamResultsByCode(exam_code: number): Observable<ExamResult[]> {
        const params = new HttpParams().set('exam_code', exam_code.toString());
        return this.http.get<ExamResult[]>(`${this.apiUrl}/search`, { params });
    }

    getExamResultsByCourseId(course_id: number): Observable<ExamResult[]> {
        const params = new HttpParams().set('course_id', course_id.toString());
        return this.http.get<ExamResult[]>(`${this.apiUrl}/search`, { params });
    }

    getExamResultsAndCoursesByProfessorId(professor_id: number): Observable<ExamResult[]> {
        return this.http.get<ExamResult[]>(`${this.apiUrl}/stats/${professor_id}`);
    }

    accept(student_id: number, exam_code: number, valueparam: boolean): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${student_id}/${exam_code}/accept`, { value: valueparam});
    }

    create(dto: ExamResultDto): Observable<ExamResult> {
        return this.http.post<ExamResult>(this.apiUrl, dto);
    }

}
