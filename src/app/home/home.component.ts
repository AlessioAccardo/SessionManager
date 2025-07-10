import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Courses } from '../interfaces/courses.interface';
import { CreateCourseDto } from '../interfaces/createCourseDto.interface';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { StudyPlanService } from '../services/studyPlan.service';
import { StudyPlan } from '../interfaces/studyPlan.interface';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { 
  IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel,
  IonButton, IonCardHeader, IonTitle, IonGrid, IonRow, IonCol, IonSelect,
  IonSelectOption, IonInput, IonSpinner 
} from '@ionic/angular/standalone';

import { firstValueFrom, Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular/standalone';

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
    IonInput,
    IonSpinner
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  coursesService = inject(CoursesService);
  studyPlanService = inject(StudyPlanService);
  userService = inject(UserService);
  alertCtrl = inject(AlertController);
  authService = inject(AuthService);

  user: LoggedUser | null = null;
  private userSubscription: Subscription | undefined;

  courses: Courses[] = [];
  studyPlan: StudyPlan[] = [];
  professors: User[] = [];

  isLoading: boolean = false;

  coursesForm: FormGroup;

  // PER STUDENTE
  libretto: boolean = true
  totalCredits: number = 0;
  MAX_CFU: number = 180;
  studentWeightedMean: number = 0;

  
  constructor(private fb: FormBuilder) {
    this.coursesForm = this.fb.group({
      name: ['', Validators.required],
      professor_id: [null, Validators.required],
      credits: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
  }

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



  // ----- SEZIONE SEGRETERIA -----
  
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

  // ELIMINA CORSO SEGRETERIA
  async deleteCourse(course_id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Conferma eliminazione',
      buttons: [
        { text: 'Cancella', role: 'cancel'},
        { 
          text: 'Conferma',
          handler: async () => {
            try {
              await firstValueFrom(this.coursesService.delete(course_id));
              this.loadCourses();
            } catch (err) {
              console.log(err);
            }
          }
        }
      ]
    });
    await alert.present()
  }


  
  // ----- SEZIONE STUDENTE -----

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




  // FUNZIONI PER IL CARICAMENTO DEI DATI


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




  // CARICA I DATI DA VISUALIZZARE DEL PROFESSORE
  async loadProfessor() {
    if (!this.user) return;
    this.isLoading = true;
    try {
      const observable = this.coursesService.getByProfessorId(this.user!.id);
      const data = await firstValueFrom(observable);
      this.courses = data;
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }


  // CARICA I DATI DA VISUALIZZARE DELLA SEGRETERIA
  async loadAdmin() {
    if (!this.user) return;
    this.isLoading = true;  
    try {
      this.adminLoadProfessors();
      this.loadCourses()
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }

  async adminLoadProfessors() {
    const obs1 = this.userService.getAllProfessors();
    const data1 = await firstValueFrom(obs1);
    this.professors = data1;
  }

  async loadCourses() {
    const obs2 = this.coursesService.getAll();
    const data2 = await firstValueFrom(obs2);
    this.courses = data2;    
  }
 
  // CARICA I DATI DA VISUALIZZARE DELLO STUDENTE
  async loadStudent() {
    if (!this.user) return;
    this.isLoading = true;    
    try {
      this.loadStudyPlan();
      this.loadStudentCourses();
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  }


  // resetta le componenti
  resetComponents() {
    this.courses = [];
    this.professors = [];
    this.studyPlan = [];
    this.totalCredits = 0;
    this.MAX_CFU = 180;
    this.studentWeightedMean = 0;
    this.isLoading = false;
    this.libretto = true;
  }

}