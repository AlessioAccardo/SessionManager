import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";

export interface CreateExamDto {
  course_id: number,
  date:      string
}

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
}

@Injectable({ providedIn: 'root' })
export class ExamService {
    private apiUrl;
    
    constructor(private http: HttpClient) {
      if (Capacitor.getPlatform() === 'web') {
      this.apiUrl = 'http://localhost:3000/api/exam';
    }
    // simulator Android
    else if (Capacitor.getPlatform() === 'android') {
      this.apiUrl = 'http://10.0.2.2:3000/api/exam';
    }
    // simulator iOS
    else if (Capacitor.getPlatform() === 'ios') {
      this.apiUrl = 'http://localhost:3000/api/exam';
    }
    // device fisico in live‑reload
    else {
      const ip = window.location.hostname;
      this.apiUrl = `http://${ip}:3000/api/exam`;
    }
    }

    getAllExams(): Observable<Exam[]> {
        return this.http.get<Exam[]>(this.apiUrl);
    }

    getAllApprovedExamsByProfId(professor_id: number): Observable<Exam[]> {
        return this.http.get<Exam[]>(`${this.apiUrl}/approved/${professor_id}`)
    }

    getAllApprovedExams(): Observable<Exam[]> {
        return this.http.get<Exam[]>(`${this.apiUrl}/approved`);
    }

    getExamByCode(code: number): Observable<Exam> {
        return this.http.get<Exam>(`${this.apiUrl}/${code}`);
    }

    getExamByName(name: string): Observable<Exam[]> {
        return this.http.get<Exam[]>(`${this.apiUrl}/${name}`)
    }

    getExamByProfessorId(professor_id: number): Observable<Exam[]> {
        return this.http.get<Exam[]>(`${this.apiUrl}/professor/${professor_id}`);
    }

    getExamByProfessorFullName(first_name: string, last_name: string): Observable<Exam[]> {
        const params = new HttpParams().set('first_name', first_name).set('last_name', last_name);
        return this.http.get<Exam[]>(`${this.apiUrl}/search`, { params });
    }

    getExamsByCourseId(course_id: number): Observable<Exam[]> {
        const params = new HttpParams().set('course_id', course_id);
        return this.http.get<Exam[]>(`${this.apiUrl}/search`, { params });
    }

    getExamRequests(): Observable<Exam[]> {
       return this.http.get<Exam[]>(`${this.apiUrl}/requested`); 
    }

    createExam(dto: CreateExamDto): Observable<Exam> {
        return this.http.post<Exam>(this.apiUrl, dto);
    }

    approveExam(code: number, approved: boolean): Observable<Exam> {
        return this.http.put<Exam>(`${this.apiUrl}/approve`, { code, approved });
    }

    setEnrolledStudentsNumber(code: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/enrolledstudents`, { code });
    }

    getStudentExams(student_id: number): Observable<Exam[]> {
        return this.http.get<Exam[]>(`${this.apiUrl}/studentexams/${student_id}`);
    }

    showExamsRequestsByProfId(professor_id: number): Observable<Exam[]> {
        const params = new HttpParams().set('professor_id', professor_id);
        return this.http.get<Exam[]>(`${this.apiUrl}/search`, { params });
    }
}