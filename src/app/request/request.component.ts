import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService, Exam, CreateExamDto } from '../services/exam.service';
import { CoursesService, Courses } from '../services/courses.service';
import { AuthService } from '../services/auth/auth.service';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { IonContent,IonCardContent, IonButton,IonInput, IonHeader, IonToolbar, IonTitle, IonLabel, IonSelect, IonSelectOption, IonGrid, IonCol, IonRow, IonCard} from '@ionic/angular/standalone';

@Component({
  selector: 'app-request',
  imports: [ReactiveFormsModule,
            IonTitle,
            IonContent,
            IonLabel,
            IonSelect,
            IonSelectOption,
            IonButton,
            IonInput,
            IonGrid,
            IonCol,
            IonRow,
            IonCard,
            IonCardContent],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
  standalone: true,
})
export class RequestComponent implements OnInit {
  router = inject(Router);

  examRequestForm: FormGroup;

  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  requests: Exam[] = [];

  courses: Courses[] = [];


  constructor(private examService: ExamService, private coursesService: CoursesService, private fb: FormBuilder) {
    this.examRequestForm = this.fb.group({
      course_id: [null, Validators.required],
      date: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    // OTTENGO L'OGGETTO USER
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      console.log('Nessun utente in local storage');
    } else {
      this.user = JSON.parse(raw) as LoggedUser;
    }

    
    if (this.user?.role === 'segreteria') {
      this.loadRequests();
    }

    if (this.user?.role === 'professore') {
      this.coursesService.getByProfessorId(this.user.id).subscribe((data) => {
        this.courses = data;
      })
    }
  }

  // FUNZIONE PER IL FORM DI RICHIESTA DI CREAZIONE DELL'ESAME DEL PROFESSORE 
  submitForm() {
    // SE IL FORM NON E VALIDO MOSTRO ALERT E RITORNO
    if (this.examRequestForm.invalid) {
      alert('Dati inseriti nel form mancanti o non validi');
      return;
    }
    const { date } = this.examRequestForm.value;
    if (new Date(date) < new Date() ) {
      alert('Non puoi creare esami per giorni passati!');
      return;
    }
    // ALTRIMENTI
    // CREO IL DTO
    const dto: CreateExamDto = this.examRequestForm.value
    // CONSUMO IL SERIVZIO DI CREATE EXAM DEFINITO IN EXAM.SERVICE.TS
    this.examService.createExam(dto).subscribe({
      next: (createdExam) => {
        alert(`Richiesta esame ${createdExam.name} con ID ${createdExam.code} mandata con successo`);
        this.examRequestForm.reset();
      },
      error: err => {
        console.log(err);
        alert(`Errore nella creazione dell'esame`);
        this.examRequestForm.reset();
      }
    });
  }

  // FUNZIONE PER CARICARE LE RICHIESTE DI CREAZIONE DI UN ESAME DEI PROFESSORI
  loadRequests() {
    this.examService.getExamRequests().subscribe((data) => {
      this.requests = data;
    });
  }

  // FUNZIONE PER APPROVARE LE RICHIESTE DEI PROFESSORI CHE UTILIZZA I SERVIZI DI EXAM.SERVICE.TS
  approveRequest(code: number, approved: boolean) {
    this.examService.approveExam(code, approved).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r.code !== code);
        this.loadRequests();
      },
      error: err => {
        console.log(err);
        alert(`Errore nell'approvazione dell'esame`);
      }
    });
  }
}