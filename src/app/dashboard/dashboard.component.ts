import { Component, inject, OnInit } from '@angular/core'; 
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { ExamService } from '../services/exam.service';
import { IonContent, IonTitle, IonCard, IonButton, IonGrid, IonRow, IonCol, AlertController} from '@ionic/angular/standalone';
import { ExamResult, ExamResultDto, ExamResultsService } from '../services/examResults.service';
import { EnrolledStudent, EnrolledStudentsService } from '../services/enrolledStudents.service';
import { firstValueFrom } from 'rxjs';
import { StudyPlanService } from '../services/studyPlan.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    CommonModule, 
    IonContent,
    IonCard, 
    IonTitle, 
    IonButton, 
    IonGrid, 
    IonRow, 
    IonCol
  ]
})
export class DashboardComponent implements OnInit {

  examService = inject(ExamService);
  userService = inject(UserService);
  enrolledStudentService = inject(EnrolledStudentsService);
  examResultsService = inject(ExamResultsService);
  alertCtrl = inject(AlertController);
  studyPlanService = inject(StudyPlanService)

  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  exams: EnrolledStudent[] = [];
  examsSet: EnrolledStudent[] = [];
  
  studentExams: ExamResult[] = [];


  ngOnInit() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      console.log('Nessun utente in local storage');
    } else {
      this.user = JSON.parse(raw) as LoggedUser;
    }
    
    // PROFESSORE
    if (this.user?.role === 'professore') {
      this.loadProfessor()
    }

    if (this.user?.role === 'studente') {
      this.loadStudent();
    } 

    if (this.user?.role === 'segreteria') {
      this.loadAdmin();
    }
  }

  getStudents(code: number) {
    return this.exams.filter(es => es.exam_code === code);
  }

  // RUOLO PROFESSORE
  // mostro l'alert con il prompt per inserire il voto, invia il voto al server e aspetta 
  // che la chiamata sia completata prima di chiudere l'alert
  async insertGradeTakenExam(studentId: number, examCode: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Inserisci Voto',
      inputs: [{ name: 'value', type: 'number', placeholder: '0–31' }],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Conferma',
          // rendiamo handler async, così possiamo usare await dentro
          handler: async (data) => {
            const num = parseInt(data.value, 10);
            if (isNaN(num)) {
              console.warn('Valore non valido:', data.value);
              // non chiude l'alert
              return false; 
            }

            const dto: ExamResultDto = {
              student_id: studentId,
              exam_code:  examCode,
              grade: num
            };

            try {
              // converto l'Observable in Promise e aspetto il risultato
              await firstValueFrom(this.examResultsService.create(dto));
              await firstValueFrom(this.enrolledStudentService.updateTaken(studentId, examCode, true));
              const dati = await firstValueFrom(this.enrolledStudentService.getEnrolledStudentsByProfId(this.user!.id));
              this.exams = dati;
              // chiude l'alert al successo
              return true;    
            } catch (err) {
              console.error('Errore durante il salvataggio del voto:', err);
              // mantiene l'alert aperto per riprovare
              return false; 
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async notTakenExam(student_id: number, exam_code: number) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma',
      message: "Sicuro che lo studente non abbia sostenuto l'esame?",
      buttons: [
        { text: 'Annulla', role: 'cancel'},
        { text: 'Conferma',
          role: 'confirm',
          handler: async () => {
            try {
              await firstValueFrom(this.enrolledStudentService.deleteEnrolledStudent(student_id, exam_code));
              this.loadProfessor();
            } catch (err) {
              console.log(err);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  computeExamsSet() {
    this.examsSet = this.exams
      .filter((exam, i, arr) => 
        arr.findIndex(e => e.exam_code === exam.exam_code) === i
      )
      .map(exam => ({
        exam_code: exam.exam_code,
        exam_name: exam.exam_name,
        student_first_name: exam.student_first_name,
        student_last_name: exam.student_last_name,
        student_id: exam.student_id,
        credits: exam.credits,
        enrolled_students: exam.enrolled_students,
        professor_id: exam.professor_id,
        date: exam.date,
        taken: exam.taken,
        course_id: exam.course_id,
        professor_first_name: exam.professor_first_name,
        professor_last_name: exam.professor_last_name
      }))
  }


  // RUOLO STUDENTE
  async accettazioneVoto(exam_code: number, value: boolean, course_id?: number, grade?: number) {
    this.examResultsService.accept(this.user!.id, exam_code, value).subscribe
    
    const alert = await this.alertCtrl.create({
      header: 'Confermi la risposta?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Conferma',
          // rendiamo handler async, così possiamo usare await dentro
          handler: async () => {
            try {
              await firstValueFrom(this.examResultsService.accept(this.user!.id, exam_code, value));
              if (value) {
                await firstValueFrom(this.studyPlanService.updateGrade(this.user!.id, course_id!, grade!))
              }
              
              //this.studentExams.filter(e => e.exam_code !== exam_code);
              const observable = this.examResultsService.getResultsByStudentId(this.user!.id);
              const data = await firstValueFrom(observable);
              this.studentExams = data;
            } catch(err){
              console.log(err);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // SCARICA DATI PROFESSORI 
  async loadProfessor() {
    const observable = this.enrolledStudentService.getEnrolledStudentsByProfId(this.user!.id);
    const data = await firstValueFrom(observable);
    this.exams = data;
    this.computeExamsSet();
  }

  // SCARICA DATI STUDENTE
  async loadStudent() {
    const observable = this.examResultsService.getResultsByStudentId(this.user!.id);
    const data = await firstValueFrom(observable);
    this.studentExams = data;
  }

  // SCARICA DATI SEGRETERIA
  async loadAdmin() {
    const observable = this.enrolledStudentService.getAll();
    const data = await firstValueFrom(observable);
    this.exams = data;
  }

}