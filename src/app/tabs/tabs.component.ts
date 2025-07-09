// src/app/tabs/tabs.page.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth/auth.service'; // Assicurati che il percorso sia corretto
import { Observable } from 'rxjs';
import { LoggedUser } from '../interfaces/loggedUser.interface'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
})
export class TabsPage {
  user$: Observable<LoggedUser | null>;

  private auth = inject(AuthService);
  private alertCtrl = inject(AlertController);

  constructor() {
    this.user$ = this.auth.user$;
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sicuro di voler fare il logout?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        { text: 'Conferma', handler: () => this.auth.logout() }
      ]
    });
    await alert.present();
  }
}