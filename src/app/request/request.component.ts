import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExamService, Exam, CreateExamDto } from '../services/exam.service';
import { CoursesService, Courses } from '../services/courses.service';
import { AuthService } from '../services/auth/auth.service';
import { LoggedUser } from '../interfaces/loggedUser.interface';

@Component({
  selector: 'app-request',
  imports: [FormsModule],
  templateUrl: './request.component.html',
  styleUrl: './request.component.scss',
  standalone: true,
})
export class RequestComponent implements OnInit {
  router = inject(Router);

  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  requests: Exam[] = [];

  courses: Courses[] = [];


  constructor(private examService: ExamService, private coursesService: CoursesService) {}

  ngOnInit(): void {
    // OTTENGO L'OGGETTO USER
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      console.log('Nessun utente in local storage');
    } else {
      this.user = JSON.parse(raw) as LoggedUser;
    }

    
    if (this.user?.role === 'segreteria') {
      this.loadRequests();
    }

    if (this.user?.role === 'professore') {
      this.coursesService.getByProfessorId(this.user.id).subscribe((data) => {
        this.courses = data;
      })
    }
  }

  onSubmit(courseInput: HTMLSelectElement, dateInput: HTMLInputElement) {

    const dto: CreateExamDto = {
      course_id: +courseInput.value,
      date: dateInput.value
    };

    this.examService.createExam(dto).subscribe({
      next: (createdExam) => {
        console.log('Esame creato: ', createdExam);
        alert(`Esame ${createdExam.name} creato con ID ${createdExam.code}`);
        courseInput.selectedIndex = 0;
        dateInput.value = "";
      },
      error: err => {
        console.log(err);
        alert(`Errore nella creazione dell'esame`);
      }
    });
  }

  loadRequests() {
    this.examService.getExamRequests().subscribe((data) => {
      this.requests = data;
    });
  }

  approveRequest(code: number, approved: boolean) {
    this.examService.approveExam(code, approved).subscribe({
      next: (approvedExam) => {
        console.log('Esame approvato', approvedExam);
        if (approved) {
          alert(`Richiesta creazione esame ${approvedExam.name} approvata`);
        } else {
          alert(`Richiesta creazione esame ${approvedExam.name} rifiutata`);
        }
        this.requests = this.requests.filter(r => r.code !== code);
        this.loadRequests();
      },
      error: err => {
        console.log(err);
        alert(`Errore nell'approvazione dell'esame`);
      }
    });
    
  }
}