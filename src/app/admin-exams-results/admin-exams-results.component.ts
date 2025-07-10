import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../services/exam.service';
import { Exam } from '../interfaces/exam.interface';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { IonContent, IonTitle, IonCard, IonButton, IonGrid, IonRow, IonCol, IonCardHeader, IonCardContent} from '@ionic/angular/standalone';
import { ExamResultsService } from '../services/examResults.service';
import { ExamResult } from '../interfaces/examResult.interface';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin-exams-results',
  imports: [
    RouterLink,
    IonCard, 
    IonTitle, 
    IonButton, 
    IonGrid, 
    IonRow, 
    IonCol,
    IonContent,
    IonCardHeader,
    IonCardContent
  ],
  templateUrl: './admin-exams-results.component.html',
  styleUrls: ['./admin-exams-results.component.scss'],
})
export class AdminExamsResultsComponent  implements OnInit {

  activatedRoute = inject(ActivatedRoute);
  examService = inject(ExamService)
  examResultsService = inject(ExamResultsService);
  authService = inject(AuthService);

  user: LoggedUser | null = null;

  private userSubscription: Subscription | undefined;

  courseId: number = 0;
  exams: Exam[] = [];
  studentsOfAnExam: ExamResult[] = [];

  selectedExamCode: number | null = null;
    
  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.resetComponents()

      if (user) {

        if (user.role === 'segreteria') {
          this.courseId = +this.activatedRoute.snapshot.paramMap.get('course_id')!;
          this.loadProfExams();
        }
      }
    });
  }

  
  async showExams(exam_code: number) {
    if (this.selectedExamCode === exam_code) {
      this.selectedExamCode = null;
      this.studentsOfAnExam.length = 0;
      return;
    }

    // apre visualizzazione
    this.selectedExamCode = exam_code;

    const observable = this.examResultsService.getExamResultsByCode(exam_code);
    const data = await firstValueFrom(observable);
    this.studentsOfAnExam = data;
  }


  async loadProfExams() {
    const observable = this.examService.getExamsByCourseId(this.courseId);
    const data = await firstValueFrom(observable);
    this.exams = data;
  }

  resetComponents() {
    this.courseId = 0;
    this.exams = [];
    this.studentsOfAnExam = [];
    this.selectedExamCode = null;
  }

}
