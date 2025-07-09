import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";

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

    private apiUrl;

    constructor(private http: HttpClient) {
      if (Capacitor.getPlatform() === 'web') {
      this.apiUrl = 'http://localhost:3000/api/auth';
    }
    // simulator Android
    else if (Capacitor.getPlatform() === 'android') {
      this.apiUrl = 'http://10.0.2.2:3000/api/auth';
    }
    // simulator iOS
    else if (Capacitor.getPlatform() === 'ios') {
      this.apiUrl = 'http://localhost:3000/api/auth';
    }
    // device fisico in live‑reload
    else {
      const ip = window.location.hostname;
      this.apiUrl = `http://${ip}:3000/api/auth`;
    }
    }

    register(payload: RegistrationDetails): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
    }

    login(payload: LoginDetails): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
    }
}