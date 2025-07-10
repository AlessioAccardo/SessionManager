import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ExamService } from '../services/exam.service';
import { Exam } from '../interfaces/exam.interface';
import { Router } from '@angular/router';
import { StudyPlanService } from '../services/studyPlan.service';
import { StudyPlan } from '../interfaces/studyPlan.interface';
import { firstValueFrom, Subscription } from 'rxjs';
import { EnrolledStudentsService } from '../services/enrolledStudents.service';
import { EnrolledStudent } from '../interfaces/enrolledStudent.interface';
import { EnrolledStudentDto } from '../interfaces/enrolledStudentDto.interface';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { AuthService } from '../services/auth/auth.service';
import { IonContent, IonButton, IonGrid, IonRow, IonCol, IonCardHeader, IonHeader, IonToolbar, IonTitle, IonCard, IonSpinner, IonCardContent } from '@ionic/angular/standalone';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonSpinner,
    IonCardHeader,
    IonCardContent
  ],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss'
})

// CLASSE PURAMENTE PER STUDENTE
export class PlanComponent implements OnInit, OnDestroy {
  
  examService = inject(ExamService);
  studyPlanService = inject(StudyPlanService);
  alertController = inject(AlertController);
  enrolledStudentService = inject(EnrolledStudentsService)
  router = inject(Router);
  authService = inject(AuthService);

  user: LoggedUser | null = null;

  private userSubscription: Subscription | undefined;

  esamiPrenotati: EnrolledStudent[] = [];
  studyPlan: StudyPlan[] = [];
  esami: Exam[] = [];

  visualizzazione: boolean = true;

  today = new Date();

  isLoading: boolean = false;

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.resetComponents()

      if (user) {
        this.isLoading = true;
        if (user.role === 'studente') {
          this.loadStudentExams();
        }
      }
    });
  }

  ngOnDestroy() {
      if (this.userSubscription) {
        this.userSubscription.unsubscribe();
      }
  }

  // ISCRIZIONE ALL'ESAME
  async seleziona(code: number) {
    const exists = this.esamiPrenotati.some(e => e.exam_code === code);
    if (exists) {
      alert('Esame gia presente nel tuo piano di studi');
      return;
    }
    const dto: EnrolledStudentDto = {
      student_id: this.user!.id,
      exam_code: code
    };
    try {
      // iscrive lo studente all'esame
      await firstValueFrom(this.enrolledStudentService.enrollStudent(dto));
      // aggiorna numero di iscritti all'esame
      await firstValueFrom(this.examService.setEnrolledStudentsNumber(code));
      // aggiorna la visualizzazione
      this.loadStudentExams();
    } catch (err) {
      alert("Errore nell'inserimento dell'esame");
    }
  }

  visualizzaEsami() {
    this.visualizzazione = !this.visualizzazione;
  }

  // DISISCRIZIONE DALL'ESAME
  async unenrollFromExam(exam_code: number, exam_name: string) {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler disiscriverti?',
      message: `L'iscrizione all'esame ${exam_name} verrà cancellata`,
      buttons: [
        { text: 'Annulla', role: 'cancel'},
        { text: 'Conferma', role: 'confirm', handler: async () => {
          try {
            // disiscrive lo studente dall'esame
            await firstValueFrom(this.enrolledStudentService.deleteEnrolledStudent(this.user!.id, exam_code));
            // aggiorna numero di iscritti all'esame
            await firstValueFrom(this.examService.setEnrolledStudentsNumber(exam_code));
            // aggiorna la visualizzazione
            this.loadStudentExams();
          } catch (err) {
           console.log(err);
          }
        }}
      ],
      backdropDismiss: false,
    });

    await alert.present();
  }

  hideOldExams(date: string): boolean {
    const examDate = new Date(date);
    examDate.setHours(0,0,0,0);
    const today = new Date(this.today);
    today.setHours(0,0,0,0);
    return examDate < today;
  }

  // CARICA DATI STUDENTE
  async loadStudentExams() {
    if (!this.user) return;
    this.isLoading = true;
    console.log(this.today);

    try {
      const obs1 = this.examService.getStudentExams(this.user!.id);
      const data1 = await firstValueFrom(obs1);
      this.esami = data1;

      const obs2 = this.enrolledStudentService.getExamsByEnrolledStudent(this.user!.id);
      const data2 = await firstValueFrom(obs2);
      this.esamiPrenotati = data2;

    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }

  }


  resetComponents() {
    this.esamiPrenotati = [];
    this.studyPlan = [];
    this.esami = [];
    this.today = new Date();
    this.isLoading = false;
  }
}
