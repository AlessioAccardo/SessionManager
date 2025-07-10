import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { Exam } from '../interfaces/exam.interface';
import { CreateExamDto } from '../interfaces/createExamDto.interface';
import { CoursesService } from '../services/courses.service';
import { Courses } from '../interfaces/courses.interface';
import { AuthService } from '../services/auth/auth.service';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { 
  IonContent,IonCardContent, IonButton,IonInput, IonCardHeader,
  IonTitle, IonLabel, IonSelect, IonSelectOption, IonGrid, IonCol, IonRow, IonCard,
  IonSpinner
} from '@ionic/angular/standalone';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-request',
  imports: [
    ReactiveFormsModule,
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
    IonCardContent,
    IonSpinner,
    IonCardHeader
  ],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
  standalone: true,
})
export class RequestComponent implements OnInit, OnDestroy {
  router = inject(Router);
  authService = inject(AuthService);
  examService = inject(ExamService);
  coursesService = inject(CoursesService);

  user: LoggedUser | null = null;
  private userSubscription: Subscription | undefined;

  requests: Exam[] = [];
  courses: Courses[] = [];
  showRequests: Exam[] = [];

  examRequestForm: FormGroup;
  isLoading: boolean = false;


  constructor(private fb: FormBuilder) {
    this.examRequestForm = this.fb.group({
      course_id: [null, Validators.required],
      date: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.resetComponents()

      if (user) {
        this.isLoading = true;

        if (user.role === 'professore') {
          this.loadCourses();
          this.loadProfessorRequests();
        } else if (user.role === 'segreteria') {
          this.loadRequests();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }


  // ------- PROFESSORE -------

  // funzione per il form di richiesta di creazione dell'esame del professore
  async submitForm() {
    // se il form non e' valido mostro alert e ritorno
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
    // creo il dto
    const dto: CreateExamDto = this.examRequestForm.value
    // consumo il servizio di create exam e resetto il form
    await firstValueFrom(this.examService.createExam(dto))
    await this.loadProfessorRequests();
    this.examRequestForm.reset();
  }

  // per caricare i corsi del professore per i quali puo mandare le richieste di creazione esame
  async loadCourses() {
    if (!this.user) return;
    this.isLoading = true;
    try {
      const obs = this.coursesService.getByProfessorId(this.user!.id);
      this.courses = await firstValueFrom(obs);
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  async loadProfessorRequests() {
    if (!this.user) return;
    this.isLoading = true;

    try {
      this.showRequests = await firstValueFrom(this.examService.showExamsRequestsByProfId(this.user.id));
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }



  //  ------- SEGRETERIA --------

  // per approvare o meno le richieste di creazione di un esame dei professori
  async approveRequest(code: number, approved: boolean) {
    await firstValueFrom(this.examService.approveExam(code, approved));
    this.loadRequests();
  }

    // per caricare le richieste di creazione di un esame dei professori
  async loadRequests() {
    if (!this.user) return;
    this.isLoading = true;

    try {
      const obs = this.examService.getExamRequests();
      this.requests = await firstValueFrom(obs);
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }



  // RESET COMPONENTS
  resetComponents() {
    this.courses = [];
    this.showRequests = [];
    this.requests = [];
    this.isLoading = false;
  }
}