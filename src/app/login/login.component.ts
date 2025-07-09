import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../services/auth/authApi.service';
import { UserRole } from '../enum/userRole.enum';
import { TitleCasePipe, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { LoggedUser } from '../interfaces/loggedUser.interface';

import { IonContent, IonCard, IonCardContent, IonCardHeader,IonTitle, IonItem, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone'

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, 
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonCardHeader, 
    IonTitle,
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonSelect, 
    IonSelectOption
  ],
  providers: [TitleCasePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})

export class LoginComponent {
  loginForm: FormGroup;
  registrationForm: FormGroup;
  errorMessage: string | null = null;
  roles: UserRole[] = [
    UserRole.studente,
    UserRole.professore,
    UserRole.segreteria
  ]

  display: boolean = false;
  displayPassError: boolean = false;

  router = inject(Router);
  private titleCase = new TitleCasePipe();
  private isBrowser!: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private fb: FormBuilder,
    private authApiService: AuthApiService,
    private auth: AuthService
  ) {

    this.isBrowser = isPlatformBrowser(platformId);

    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.registrationForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
      role: ['studente', Validators.required]
    });
  }

  onSubmit(): void {

    if (!this.display) {
      if (this.loginForm.invalid) {
      return;
      }
      const { email, password } = this.loginForm.value;
      this.authApiService.login({ email, password })
      .subscribe({
        next: res => {
          this.auth.login(res.data as LoggedUser, res.token);
          this.loginForm.reset();    
        },
        error: err => {
          this.errorMessage = err.error?.message || 'Errore di login';
          alert(this.errorMessage);
          this.loginForm.reset();
        }
      });
      
    } else {
      if (this.registrationForm.invalid) {
      return;
      }
      if (this.registrationForm.get('password')?.value !== this.registrationForm.get('passwordConfirm')?.value) {
        this.displayPassError = true;
        return;
      }
      if (this.isBrowser) {
        let { first_name, last_name, email, password, role } = this.registrationForm.value;
        first_name = this.titleCase.transform(first_name);
        last_name = this.titleCase.transform(last_name);
        this.authApiService.register({ first_name, last_name, email, password, role })
        .subscribe({
          next: res => {
            alert('Registrazione avvenuta con successo');
            this.registrationForm.reset();
            this.router.navigate(['/login']);
            this.display = false;
          }, error: err => {
            this.errorMessage = err.error?.message || 'Errore nella registrazione';
            alert(this.errorMessage);
            this.registrationForm.reset();
          }
        });
      } else {
        console.log('Errore per localStorage is browser: ', this.isBrowser);
      }

    }
    
  }

  toggle() {
    this.display = !this.display;
  }
}
