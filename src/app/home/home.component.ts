import { Component, OnInit, inject } from '@angular/core';
import { CoursesService, Courses, CreateCourseDto } from '../services/courses.service';
import { UserService, User} from '../services/user.service';
import { StudyPlanService, StudyPlan } from '../services/studyPlan.service';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonCardHeader, IonTitle, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonInput } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-courses',
  imports: [
    ReactiveFormsModule,
    CommonModule, 
    IonContent,
    IonCard, 
    IonCardContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonButton, 
    IonCardHeader,  
    IonTitle,
    IonGrid, 
    IonRow, 
    IonCol, 
    IonSelect, 
    IonSelectOption, 
    IonInput
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  courses: Courses[] = [];
  studyPlan: StudyPlan[] = [];
  professors: User[] = [];

  user: LoggedUser | null = null;
  user$ = inject(AuthService).user$;

  coursesForm: FormGroup;

  // PER STUDENTE
  libretto: boolean = true
  totalCredits: number = 0;
  MAX_CFU: number = 180;
  studentWeightedMean: number = 0;
  
  constructor(public coursesService: CoursesService, public studyPlanService: StudyPlanService, public userService: UserService, private fb: FormBuilder) {
    this.coursesForm = this.fb.group({
      name: ['', Validators.required],
      professor_id: [null, Validators.required],
      credits: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

  ngOnInit() {

    // OTTENGO L'OGGETTO USER
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      console.log('Nessun utente in local storage');
    } else {
      this.user = JSON.parse(raw) as LoggedUser;
    }

    // SEGRETERIA
    if (this.user?.role === 'segreteria') {
      this.loadAdmin();
    }

    // STUDENTE
    if (this.user!.role === 'studente') {
      this.loadStudyPlan();
      this.loadStudentCourses();
    }

    // PROFESSORE
    if (this.user?.role === 'professore') {
      this.loadProfessor();
    }
  }
  
  // CREA CORSO SEGRETERIA
  async createCourse() {
    if (this.coursesForm.invalid) {
      alert('Form non valido');
      return;
    }
    const dto: CreateCourseDto = this.coursesForm.value;

    try {
      await firstValueFrom(this.coursesService.create(dto));
      this.coursesForm.reset();
      this.loadAdmin();
    } catch (err) {
      alert('Errore nella creazione del corso');
    }
  }

  // AGGIUNZIONE CORSO DA PARTE DELLO STUDENTE
  async salvaPiano(courseId: number) {
    
    if (this.totalCredits < 180) {
      const dto = {
        student_id: this.user!.id,
        course_id: +courseId
      };
    
      try {
        await firstValueFrom(this.studyPlanService.create(dto));

        this.loadStudyPlan();
        this.loadStudentCourses();
      } catch (err) {
        console.log(err);
        alert("Errore nell'aggiunzione del piano");
      }
    } else {
      alert('180 CFU raggiunti, congratulazioni!');
    }
  }

  // MEDIA PESATA STUDENTE
  weightedMeanCompute() {
    let weightedSum: number = 0;
    let creditsCounter: number = 0;

    for (const record of this.studyPlan) {
      if (record.grade !== null) {
        weightedSum += record.grade * record.credits;
        creditsCounter += record.credits
      }
    }
    let stdWMean: number = parseFloat((weightedSum / creditsCounter).toFixed(2));
    this.studentWeightedMean = (this.totalCredits > 0) ? stdWMean : 0;
  }

  visualizzaCorsi() {
    this.libretto = !this.libretto;
  }


  // CARICA PIANO STUDENTE
  async loadStudyPlan() {
    try {
    const observable = this.studyPlanService.getByStudentId(this.user!.id);
    const plan = await firstValueFrom(observable);
    this.studyPlan = plan;
    this.totalCredits = this.studyPlan
          .filter(course => course.grade !== null)
          .reduce((acc, course) => acc + course.credits, 0);
    } catch (err) {
      console.log(err);
    }
  }

  // CARICA CORSI CHE LO STUDENTE PUO AGGIUNGERE
  async loadStudentCourses() {
    try {
      const observable = this.coursesService.getCompStudent(this.user!.id);
      const course = await firstValueFrom(observable);
      this.courses = course;
      this.weightedMeanCompute();

    } catch (err) {
      console.log(err);
    }
  }

  // CARICA I DATI DA VISUALIZZARE DELLA SEGRETERIA
  async loadAdmin() {
    try {
      const obs1 = this.userService.getAllProfessors();
      const data1 = await firstValueFrom(obs1);
      this.professors = data1;

      const obs2 = this.coursesService.getAll();
      const data2 = await firstValueFrom(obs2);
      this.courses = data2;
    } catch (err) {
      console.log(err);
    }
  }

  // CARICA I DATI DA VISUALIZZARE DEL PROFESSORE
  async loadProfessor() {
    try {
      const observable = this.coursesService.getByProfessorId(this.user!.id);
      const data = await firstValueFrom(observable);
      this.courses = data;
    } catch (err) {
      console.log(err);
    }
  }
}