import { Component, inject} from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { IonButton, IonButtons } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  imports: [
    CommonModule,
    IonButton,
    IonButtons,
    RouterLink,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {

  user$: Observable<LoggedUser | null>;

  auth = inject(AuthService);
  router = inject(Router);
  alertCtrl = inject(AlertController)

  constructor() {
    this.user$ = this.auth.user$;
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sicuro di voler fare il logout?',
      buttons: [
        { text: 'Annulla', role: 'cancel'},
        { text: 'Conferma', handler: () => this.auth.logout() }
      ]
    });
    await alert.present();
  }

 goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

}
