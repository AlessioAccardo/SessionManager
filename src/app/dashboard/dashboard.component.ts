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
    IonCol]
})
export class DashboardComponent implements OnInit {

  examService = inject(ExamService);
  userService = inject(UserService);
  enrolledStudentService = inject(EnrolledStudentsService);
  examResultsService = inject(ExamResultsService);
  alertCtrl = inject(AlertController);

  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  exams: EnrolledStudent[] = [];


  ngOnInit() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      console.log('Nessun utente in local storage');
    } else {
      this.user = JSON.parse(raw) as LoggedUser;
    }
    
    // PROFESSORE
    if (this.user?.role === 'professore') {
      this.enrolledStudentService.getEnrolledStudentsByProfId(this.user.id).subscribe((data) => {
        this.exams = data;
      });
    }

    if (this.user?.role === 'studente') {
      this.enrolledStudentService.getExamsByEnrolledStudent(this.user.id).subscribe((data) => {
        this.exams = data;
      });
    } 

    if (this.user?.role === 'segreteria') {
      this.enrolledStudentService.getAll().subscribe((data) => {
        this.exams = data;
      })
    }
  }

  getStudents(code: number) {
    return this.exams.filter(es => es.exam_code === code);
  }

  // RUOLO PROFESSORE
  // mostro l'alert con il prompt per inserire il voto, invia il voto al server e aspetta 
  // che la chiamata sia completata prima di chiudere l'alert
  async insertGrade(examCode: number, studentId: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Inserisci Voto',
      inputs: [{ name: 'value', type: 'number', placeholder: '0–31' }],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Conferma',
          // Rendiamo handler async, così possiamo await dentro
          handler: async (data) => {
            const num = parseInt(data.value, 10);
            if (isNaN(num)) {
              console.warn('Valore non valido:', data.value);
              return false; // non chiude l'alert
            }

            const dto: ExamResultDto = {
              student_id: studentId,
              exam_code:  examCode,
              grade:      num,
            };

            try {
              // converto l'Observable in Promise e aspetto il risultato
              await firstValueFrom(this.examResultsService.create(dto));
              const data = await firstValueFrom(this.enrolledStudentService.getEnrolledStudentsByProfId(this.user!.id));
              this.exams = data;
              return true;    // chiude l'alert al successo
            } catch (err) {
              console.error('Errore durante il salvataggio del voto:', err);
              // qui potresti mostrare un toast con l'errore
              return false;   // mantiene aperto l'alert per riprovare
            }
          }
        }
      ]
    });

    await alert.present();
  }

}