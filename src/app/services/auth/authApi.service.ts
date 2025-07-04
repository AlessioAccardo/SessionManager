import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export enum UserRole {
  studente   = 'studente',
  segreteria = 'segreteria',
  professore = 'professore'
}

export interface RegistrationDetails {
  first_name: string,
  last_name: string,
  email: string,
  password: string,
  role: UserRole
}

export interface LoginDetails {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    data: {
        first_name: string;
        last_name: string;
        email: string,
        role: UserRole;
    }
}

@Injectable({ providedIn: 'root'})
export class AuthApiService {
    private apiUrl = 'http://localhost:3000/api/auth';

    constructor(private http: HttpClient) {}

    register(payload: RegistrationDetails): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
    }

    login(payload: LoginDetails): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
    }

    /*
    logout(): Observable<void> {
      return this.http.post<void>(`${this.apiUrl}/logout`, {});
    }

    isLoggedIn(): boolean {
      return !!localStorage.getItem('token'); 
    }

    me(): Observable<AuthResponse['data']> {
      return this.http.get<AuthResponse['data']>(`${this.apiUrl}/me`);
    }
    */
}