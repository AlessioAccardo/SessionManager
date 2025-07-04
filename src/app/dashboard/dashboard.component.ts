import { Component, inject, OnInit } from '@angular/core'; 
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { ExamService } from '../services/exam.service';
import { IonContent, IonTitle, IonCard, IonButton, IonGrid, IonRow, IonCol} from '@ionic/angular/standalone';
import { ExamResultsService } from '../services/examResults.service';
import { EnrolledStudent, EnrolledStudentsService } from '../services/enrolledStudents.service';

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

  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  exams: EnrolledStudent[] = [];


  ngOnInit(): void {
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
    } else 

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



}