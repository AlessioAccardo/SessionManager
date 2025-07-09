import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";
import { EnrolledStudent } from "../interfaces/enrolledStudent.interface";
import { EnrolledStudentDto } from "../interfaces/enrolledStudentDto.interface";

@Injectable({ providedIn: 'root' })
export class EnrolledStudentsService {
    private apiUrl;

    constructor(private http: HttpClient) {
        if (Capacitor.getPlatform() === 'web') {
            this.apiUrl = 'http://localhost:3000/api/enrolledStudents';
        }
        // simulator Android
        else if (Capacitor.getPlatform() === 'android') {
            this.apiUrl = 'http://10.0.2.2:3000/api/enrolledStudents';
        }
        // simulator iOS
        else if (Capacitor.getPlatform() === 'ios') {
            this.apiUrl = 'http://localhost:3000/api/enrolledStudents';
        }
        // device fisico in live‑reload
        else {
            const ip = window.location.hostname;
            this.apiUrl = `http://${ip}:3000/api/enrolledStudents`;
        }
    }

    enrollStudent(dto: EnrolledStudentDto): Observable<EnrolledStudentDto> {
        return this.http.post<EnrolledStudentDto>(`${this.apiUrl}/enroll`, dto);
    }

    getAll(): Observable<EnrolledStudent[]> {
        return this.http.get<EnrolledStudent[]>(this.apiUrl);
    }

    getExamsByEnrolledStudent(student_id: number): Observable<EnrolledStudent[]> {
        const params = new HttpParams().set('student_id', student_id)
        return this.http.get<EnrolledStudent[]>(`${this.apiUrl}/search`, { params });
    }

    getEnrolledStudentsByExam(exam_code: number): Observable<EnrolledStudent[]> {
        const params = new HttpParams().set('exam_code', exam_code)
        return this.http.get<EnrolledStudent[]>(`${this.apiUrl}/search`, { params });
    }

    getEnrolledStudentsByProfId(professor_id: number): Observable<EnrolledStudent[]> {
        const params = new HttpParams().set('professor_id', professor_id)
        return this.http.get<EnrolledStudent[]>(`${this.apiUrl}/search`, { params });
    }

    updateTaken(student_id: number, exam_code: number, takenParam: boolean): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${student_id}/${exam_code}/taken`, { taken: takenParam });
    }

    deleteEnrolledStudent(student_id: number, exam_code: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${student_id}/${exam_code}`);
    }
}