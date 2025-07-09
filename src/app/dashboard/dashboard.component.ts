import { Component, inject, OnDestroy, OnInit } from '@angular/core'; 
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../services/user.service';
import { ExamService } from '../services/exam.service';
import { IonContent, IonTitle, IonCard, IonButton, IonGrid, IonRow, IonCol, AlertController, IonSpinner} from '@ionic/angular/standalone';
import { ExamResult, ExamResultDto, ExamResultsService } from '../services/examResults.service';
import { EnrolledStudent, EnrolledStudentsService } from '../services/enrolledStudents.service';
import { firstValueFrom, forkJoin, Subscription } from 'rxjs';
import { StudyPlanService } from '../services/studyPlan.service';
import { RouterLink } from '@angular/router';
import { Courses, CoursesService } from '../services/courses.service';
import { CoursesDetailsForAdmin } from '../interfaces/coursesDetailsForAdmin.interface';

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
    IonCol,
    IonSpinner,
    RouterLink
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  examService = inject(ExamService);
  userService = inject(UserService);
  enrolledStudentService = inject(EnrolledStudentsService);
  examResultsService = inject(ExamResultsService);
  alertCtrl = inject(AlertController);
  studyPlanService = inject(StudyPlanService)
  coursesService = inject(CoursesService);
  authService = inject(AuthService);

  user: LoggedUser | null = null;

  private userSubscription: Subscription | undefined;

  exams: EnrolledStudent[] = [];
  examsSet: EnrolledStudent[] = [];
  
  studentExams: ExamResult[] = [];

  // SEGRETERIA
  professors: User[] = [];
  examResultsForStats: ExamResult[] = [];
  coursesDetailsForAdmin: CoursesDetailsForAdmin[] = [];
  showCoursesController: boolean = false;
  selectedProfessorId: number | null = null;

  isLoading: boolean = false;


  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.user = user;
      this.resetComponents()

      if (user) {
        this.isLoading = true;

        if (user.role === 'professore') {
          this.loadProfessor();
        } else if (user.role === 'studente') {
          this.loadStudent();
        } else if (user.role === 'segreteria') {
          this.loadAdmin();
        }
      }
    });
  }

  // evita memory leak
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
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
              await firstValueFrom(forkJoin([this.examResultsService.create(dto), this.enrolledStudentService.updateTaken(studentId, examCode, true)]));
              await this.loadProfessor();
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
  }


  // RUOLO STUDENTE
  async acceptGrade(exam_code: number, value: boolean, course_id?: number, grade?: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confermi la risposta?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Conferma',
          handler: async () => {
            try {
              await firstValueFrom(this.examResultsService.accept(this.user!.id, exam_code, value));

              if (value) {
                await firstValueFrom(this.studyPlanService.updateGrade(this.user!.id, course_id!, grade!))
              } 

              if (!value) {
                await firstValueFrom(this.enrolledStudentService.deleteEnrolledStudent(this.user!.id, exam_code));
              }

              this.loadStudent();
              
            } catch(err){
              console.log(err);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteResult(exam_code: number) {
    await firstValueFrom(this.examResultsService.accept(this.user!.id, exam_code, false));
    await firstValueFrom(this.enrolledStudentService.deleteEnrolledStudent(this.user!.id, exam_code));
    this.loadStudent();
  }


  // RUOLO SEGRETERIA

  async showCourses(professorId: number) {
    this.coursesDetailsForAdmin.length = 0;
    // chiude visualizzazione
    if (this.selectedProfessorId === professorId) {
      this.selectedProfessorId = null;
      return;
    }

    // apre visualizzazione
    this.selectedProfessorId = professorId;
    const obs = this.examResultsService.getExamResultsAndCoursesByProfessorId(professorId);
    this.examResultsForStats = await firstValueFrom(obs);

    this.loadStats(professorId);

  }


  async loadStats(professor_id: number) {
    const obs = this.examResultsService.getExamResultsAndCoursesByProfessorId(professor_id);
    this.examResultsForStats = await firstValueFrom(obs);
    this.coursesDetailsForAdmin = [];

    let array: number[] = [];

    for (const result of this.examResultsForStats) {
      const { course_id, course_name, course_credits, grade } = result;
      if (!array.includes(course_id)) {
        let newArr: ExamResult[] = this.examResultsForStats.filter(r => r.course_id === course_id);
        let passedGrades: number = 0;
        let failedGrades: number = 0;
        const studentLength: number = newArr.filter(e => e.grade !== null).length;
        array.push(course_id);
        for (let r of newArr) {
          if (r.grade >= 18 && r.grade !== null) passedGrades++;
          if (r.grade < 18 && r.grade !== null) failedGrades++; 
        }   

        let passed = parseFloat(((passedGrades / studentLength) * 100).toFixed(2));
        let failed = parseFloat(((failedGrades / studentLength) * 100).toFixed(2));

        const stat: CoursesDetailsForAdmin = {
          id: course_id,
          name: course_name,
          credits: course_credits,
          passed: passed,
          failed: failed
        }

        this.coursesDetailsForAdmin.push(stat);
      }  
    }    
  }



  // SCARICA DATI PROFESSORI 
  async loadProfessor() {
    if (!this.user) return;
    this.isLoading = true;
    try {
      const observable = this.enrolledStudentService.getEnrolledStudentsByProfId(this.user!.id);
      const data = await firstValueFrom(observable);
      this.exams = data;
      this.computeExamsSet();
    } catch (err) {
      console.log('Errore caricamento dati professore', err);
    } finally {
      this.isLoading = false;
    }
  }

  // SCARICA DATI STUDENTE
  async loadStudent() {
    if (!this.user) return;
    this.isLoading = true;
    try {
      const observable = this.examResultsService.getResultsByStudentId(this.user!.id);
      const data = await firstValueFrom(observable);
      this.studentExams = data; 
    } catch (err) {
      console.log('Errore caricamento dati studente', err);
    } finally {
      this.isLoading = false;
    }
  }

  // SCARICA DATI SEGRETERIA
  async loadAdmin() {
    if (!this.user) return;
    this.isLoading = true;
    try {
      const observable = this.userService.getAllProfessors();
      const data = await firstValueFrom(observable);
      this.professors = data;      
    } catch (err) {
      console.log('Errore caricamento segreteria', err);
    } finally {
      this.isLoading = false;
    }
  }



  resetComponents() {
    this.isLoading = false;
    this.exams = [];
    this.examsSet = [];
    this.studentExams = [];
    this.professors = [];
    this.examResultsForStats = [];
    this.coursesDetailsForAdmin = [];
    this.selectedProfessorId = null;
  }

}