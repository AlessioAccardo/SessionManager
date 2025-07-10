import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";
import { StudyPlan } from "../interfaces/studyPlan.interface";
import { CreateStudyPlanDto } from "../interfaces/createStudyPlanDto.interface";


@Injectable({ providedIn: 'root'})
export class StudyPlanService {
    private apiUrl;

    constructor(private http: HttpClient) {
      if (Capacitor.getPlatform() === 'web') {
      this.apiUrl = 'http://localhost:3000/api/studyPlan';
    }
    // simulator Android
    else if (Capacitor.getPlatform() === 'android') {
      this.apiUrl = 'http://10.0.2.2:3000/api/studyPlan';
    }
    // simulator iOS
    else if (Capacitor.getPlatform() === 'ios') {
      this.apiUrl = 'http://localhost:3000/api/studyPlan';
    }
    // device fisico in live‑reload
    else {
      const ip = window.location.hostname;
      this.apiUrl = `http://${ip}:3000/api/studyPlan`;
    }
    }

    getByStudentId(student_id: number): Observable<StudyPlan[]>{
        return this.http.get<StudyPlan[]>(`${this.apiUrl}/student/${student_id}`);
    }

    create(dto: CreateStudyPlanDto): Observable<CreateStudyPlanDto> {
        return this.http.post<CreateStudyPlanDto>(this.apiUrl, dto);
    }

    updateGrade(student_id: number, course_id: number, grade: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/${student_id}/${course_id}/grade`, { grade });
    }
}