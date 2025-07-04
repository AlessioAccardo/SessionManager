import { Component, inject } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { LoggedUser } from '../interfaces/loggedUser.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { IonButton, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, IonButton, IonButtons, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {

  constructor() { }

  user: LoggedUser | null = null;

  user$ = inject(AuthService).user$;
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
  }

 goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

}
