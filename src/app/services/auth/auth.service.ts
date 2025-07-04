// auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoggedUser } from '../../interfaces/loggedUser.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;
  public userSubject: BehaviorSubject<LoggedUser|null>;

  user$: Observable<LoggedUser|null>;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
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
    this.router.navigate(['/home']);
  }

  logout() {
    const loggingOut = window.confirm("Sei sicuro di voler fare il logout?");
    if (loggingOut) {
      if (this.isBrowser) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
      this.userSubject.next(null);
      this.router.navigateByUrl('/login');
    }    
  }
}
