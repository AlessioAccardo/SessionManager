import { Component, OnInit, inject } from '@angular/core';
import { ExamService, Exam } from '../services/exam.service';
import { Router } from '@angular/router';
import { StudyPlan, StudyPlanService } from '../services/studyPlan.service';
import { Observable } from 'rxjs';
import { EnrolledStudent, EnrolledStudentsService, EnrolledStudentDto } from '../services/enrolledStudents.service';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { AuthService } from '../services/auth/auth.service';
AuthService


@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss'
})
export class PlanComponent implements OnInit {
  router = inject(Router);
  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  esamiPrenotati: EnrolledStudent[] = [];
  studyPlan: StudyPlan[] = [];
  esami: Exam[] = [];
  allEsami: Exam[] = []; 

  visualizzazione: boolean = true;
  searchText: string = '';

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
      this.loadStudentThings();
    }
  }

  getExamByCode(code: number): Observable<Exam> {
    return this.examService.getExamByCode(code);
  }

  seleziona(code: number) {
    const exists = this.esamiPrenotati.some(e => e.exam_code === code);
    if (!exists) {
      const dto: EnrolledStudentDto = {
        student_id: this.user!.id,
        exam_code: code
      };
      this.enrolledStudentService.enrollStudent(dto).subscribe({
        next: () => {
          this.examService.setEnrolledStudentsNumber(code).subscribe({
            next: () => {
              alert('Esame prenotato correttamente');
              this.loadStudentThings();
              this.esami = this.esami.filter(e => e.code !== code);
              this.allEsami = this.allEsami.filter(e => e.code !== code);
            },
            error: () => {
              alert("Errore nell'aggiornamento del numero di iscritti");
            }
          });
        },
        error: () => {
          alert("Errore nell\'inserimento dell\'esame");
        }
      });
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
  loadStudentThings() {
    this.enrolledStudentService.getExamsByEnrolledStudent(this.user!.id).subscribe(data => {
      this.esamiPrenotati = data;
    });

    this.examService.getStudentExams(this.user!.id).subscribe(data => {
      this.esami = data;
      this.allEsami = [...data]; 
    });
  }
}
