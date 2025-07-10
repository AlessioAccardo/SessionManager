import { Injectable} from "@angular/core";
import { HttpClient, HttpParams} from "@angular/common/http";
import { Observable } from "rxjs";
import { Capacitor } from "@capacitor/core";
import { User } from "../interfaces/user.interface";

@Injectable({providedIn: 'root'})
export class UserService{
    private apiUrl;

    constructor(private http: HttpClient) {
          if (Capacitor.getPlatform() === 'web') {
          this.apiUrl = 'http://localhost:3000/api/user';
        }
        // simulator Android
        else if (Capacitor.getPlatform() === 'android') {
          this.apiUrl = 'http://10.0.2.2:3000/api/user';
        }
        // simulator iOS
        else if (Capacitor.getPlatform() === 'ios') {
          this.apiUrl = 'http://localhost:3000/api/user';
        }
        // device fisico in live‑reload
        else {
          const ip = window.location.hostname;
          this.apiUrl = `http://${ip}:3000/api/user`;
        }
        }

    getAllUsers(): Observable<User[]>{
        return this.http.get<User[]>(this.apiUrl);
    }

    getAllProfessors(): Observable<User[]>{
        return this.http.get<User[]>(`${this.apiUrl}/professors`);
    }

}