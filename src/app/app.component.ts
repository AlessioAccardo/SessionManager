import { Component } from '@angular/core';
import { IonApp, IonMenu, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent} from '@ionic/angular/standalone';
import { NavBarComponent } from './nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonMenu, IonRouterOutlet,IonHeader, IonToolbar, IonTitle,IonContent, NavBarComponent],
})
export class AppComponent {
  
}
