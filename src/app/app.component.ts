// app.component.ts

import { Component} from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [CommonModule, IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent, NavBarComponent],
  standalone: true,
})
export class AppComponent{

}