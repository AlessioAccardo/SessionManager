import { Injectable} from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";

export interface User{
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
    credits?: number,
    mean?: number
}

@Injectable({providedIn: 'root'})
export class UserService{
    private apiUrl = 'http://localhost:3000/api/user';

    constructor(private http: HttpClient){}

    getAllUsers(): Observable<User[]>{
        return this.http.get<User[]>(this.apiUrl);
    }

    getAllProfessors(): Observable<User[]>{
        return this.http.get<User[]>(`${this.apiUrl}/professors`);
    }

    getByFName(first_name: string): Observable<User[]>{
        return this.http.get<User []> (`${this.apiUrl}/${first_name}`);
    }

    getByLName(last_name: string): Observable<User[]>{
        return this.http.get<User []> (`${this.apiUrl}/${last_name}`)
    }

    getByFullName(first_name: string, last_name: string): Observable<User []>{
        const params = new HttpParams().set('first_name', first_name).set('last_name', last_name);
        return this.http.get<User []>(`${this.apiUrl}/search`, {params});
    }

    getById(id: number): Observable<User>{
        return this.http.get<User>(`${this.apiUrl}/${id}`);
    }

    getProfessorById(id: number): Observable<User>{
        return this.http.get<User>(`${this.apiUrl}/professor/${id}`);
    }

    getByEmail(email: string): Observable<User>{
        return this.http.get<User>(`${this.apiUrl}/${email}`);
    }
}