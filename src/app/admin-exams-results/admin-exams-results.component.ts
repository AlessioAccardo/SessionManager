import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exam, ExamService } from '../services/exam.service';
import { firstValueFrom } from 'rxjs';
import { IonContent, IonTitle, IonCard, IonButton, IonGrid, IonRow, IonCol, AlertController} from '@ionic/angular/standalone';
import { ExamResult, ExamResultsService } from '../services/examResults.service';

@Component({
  selector: 'app-admin-exams-results',
  imports: [
    IonCard, 
    IonTitle, 
    IonButton, 
    IonGrid, 
    IonRow, 
    IonCol
  ],
  templateUrl: './admin-exams-results.component.html',
  styleUrls: ['./admin-exams-results.component.scss'],
})
export class AdminExamsResultsComponent  implements OnInit {

  activatedRoute = inject(ActivatedRoute);
  examService = inject(ExamService)
  examResultsService = inject(ExamResultsService);

  courseId: number = 0;
  exams: Exam[] = [];

  studentsOfAnExam: ExamResult[] = [];

  selectedExamCode: number | null = null;
    
  ngOnInit() {
    this.courseId = +this.activatedRoute.snapshot.paramMap.get('course_id')!;
    this.loadProfExams();
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

}
