// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoggedUser } from '../../interfaces/loggedUser.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;
  public userSubject: BehaviorSubject<LoggedUser|null>;

  user$: Observable<LoggedUser|null>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private http: HttpClient
  ) {
    // Verifico se sono in un browser
    this.isBrowser = isPlatformBrowser(platformId);

    // Carico l’utente dal localStorage solo se in browser, altrimenti null
    const storedUser = this.isBrowser
      ? localStorage.getItem('currentUser')
      : null;

    this.userSubject = new BehaviorSubject<LoggedUser|null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.user$ = this.userSubject.asObservable();
  }

  login(user: LoggedUser, token: string) {
    if (this.isBrowser) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
    }
    this.userSubject.next(user);
    this.router.navigate(['/tabs/home']);
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.userSubject.next(null);
    this.router.navigateByUrl('/login');  
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  async verify(): Promise<any> {
    const token = this.getToken();
    if (!token) throw new Error('Nessun token in storage');
    return await firstValueFrom(this.http.post('/api/auth/verify', {}, { headers: { Authorization: `Bearer ${token}`}}));
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() / 1000 > payload.exp;
    } catch {
      return true;
    }
  }

}
