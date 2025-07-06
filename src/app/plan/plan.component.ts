import { Component, OnInit, inject } from '@angular/core';
import { ExamService, Exam } from '../services/exam.service';
import { Router } from '@angular/router';
import { StudyPlan, StudyPlanService } from '../services/studyPlan.service';
import { firstValueFrom, Observable } from 'rxjs';
import { EnrolledStudent, EnrolledStudentsService, EnrolledStudentDto } from '../services/enrolledStudents.service';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { AuthService } from '../services/auth/auth.service';
import { IonContent,IonButton,IonGrid, IonRow, IonCol, IonInput, IonHeader, IonToolbar, IonTitle, IonCard, IonItem} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [IonContent,
    IonButton, 
    IonGrid, 
    IonRow, 
    IonCol,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonItem],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss'
})
export class PlanComponent implements OnInit {

  private alertController = inject(AlertController);

  router = inject(Router);
  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  esamiPrenotati: EnrolledStudent[] = [];
  studyPlan: StudyPlan[] = [];
  esami: Exam[] = [];
  allEsami: Exam[] = []; 

  visualizzazione: boolean = true;
  searchText: string = '';

  today = new Date();

  constructor(
    public examService: ExamService,
    public studyPlanService: StudyPlanService,
    public enrolledStudentService: EnrolledStudentsService
  ) {}

  ngOnInit() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      console.log('Nessun utente in local storage');
    } else {
      this.user = JSON.parse(raw) as LoggedUser;
    }

    if (this.user?.role === 'studente') {
      this.loadStudentExams();
    }
  }

  getExamByCode(code: number): Observable<Exam> {
    return this.examService.getExamByCode(code);
  }

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
      await firstValueFrom(this.enrolledStudentService.enrollStudent(dto));
      await firstValueFrom(this.examService.setEnrolledStudentsNumber(code));
      this.loadStudentExams();
    } catch (err) {
      alert("Errore nell'inserimento dell'esame");
    }
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    this.searchText = value;

    this.esami = this.allEsami.filter(esame =>
      esame.name.toLowerCase().includes(value) ||
      String(esame.course_id).includes(value)
    );
  }

  visualizzaEsami() {
    this.visualizzazione = !this.visualizzazione;
  }

  //STUDENTE
  async loadStudentExams() {

    const obs1 = this.examService.getStudentExams(this.user!.id);
    const data1 = await firstValueFrom(obs1);
    this.esami = data1;

    const obs2 = this.enrolledStudentService.getExamsByEnrolledStudent(this.user!.id);
    const data2 = await firstValueFrom(obs2);
    this.esamiPrenotati = data2;

  }

  async unenrollFromExam(exam_code: number, exam_name: string) {
    const alert = await this.alertController.create({
      header: 'Sei sicuro di voler disiscriverti?',
      message: `L'iscrizione all'esame ${exam_name} verrà cancellata`,
      buttons: [
        { text: 'Annulla', role: 'cancel'},
        { text: 'Conferma', role: 'confirm', handler: async () => {
          try {
            await firstValueFrom(this.enrolledStudentService.unenrollStudent(this.user!.id, exam_code));
            await firstValueFrom(this.examService.setEnrolledStudentsNumber(exam_code));
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

  disabledButton(date: string): boolean {
    const examDate = new Date(date);
    examDate.setHours(0,0,0,0);
    const today = new Date(this.today);
    today.setHours(0,0,0,0);
    return examDate <= today;
  }
}
