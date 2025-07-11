import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";
import { Courses } from "../interfaces/courses.interface";
import { CreateCourseDto } from "../interfaces/createCourseDto.interface";

@Injectable({ providedIn: 'root' })
export class CoursesService {
    private apiUrl;

    constructor(private http: HttpClient) {
          if (Capacitor.getPlatform() === 'web') {
          this.apiUrl = 'http://localhost:3000/api/courses';
        }
        // simulator Android
        else if (Capacitor.getPlatform() === 'android') {
          this.apiUrl = 'http://10.0.2.2:3000/api/courses';
        }
        // simulator iOS
        else if (Capacitor.getPlatform() === 'ios') {
          this.apiUrl = 'http://localhost:3000/api/courses';
        }
        // device fisico in live‑reload
        else {
          const ip = window.location.hostname;
          this.apiUrl = `http://${ip}:3000/api/courses`;
        }
    }

    getAll(): Observable<Courses[]> {
        return this.http.get<Courses[]>(`${this.apiUrl}`);
    }

    getCompStudent(student_id: number): Observable<Courses[]> {
        const params = new HttpParams().set('student_id', student_id.toString());
        return this.http.get<Courses[]>(`${this.apiUrl}/search`, { params });
    }

    getById(id: number): Observable<Courses> {
        return this.http.get<Courses>(`${this.apiUrl}/${id}`);
    }

    getByProfessorId(professor_id: number): Observable<Courses[]> {
        const params = new HttpParams().set('professor_id', professor_id.toString());
        return this.http.get<Courses[]>(`${this.apiUrl}/search`, { params });
    }

    create(dto: CreateCourseDto): Observable<Courses> {
        return this.http.post<Courses>(this.apiUrl, dto);
    }

    delete(course_id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${course_id}`);
    }

}