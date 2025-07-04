import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";


export interface CreateStudyPlanDto {
  student_id: number;
  course_id: number;
}

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
}

@Injectable({ providedIn: 'root'})
export class StudyPlanService {
    private apiUrl = 'http://localhost:3000/api/studyPlan';

    constructor(private http: HttpClient) {}

    getByStudentId(student_id: number): Observable<StudyPlan[]>{
        return this.http.get<StudyPlan[]>(`${this.apiUrl}/student/${student_id}`);
    }

    getByStudentFullName(first_name: string, last_name: string): Observable<StudyPlan[]> {
        const params = new HttpParams().set('first_name', first_name).set('last_name', last_name);
        return this.http.get<StudyPlan[]>(`${this.apiUrl}/search`, { params });
    }

    create(dto: CreateStudyPlanDto): Observable<CreateStudyPlanDto> {
        return this.http.post<CreateStudyPlanDto>(this.apiUrl, dto);
    }

}