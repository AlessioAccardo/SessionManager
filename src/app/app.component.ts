// app.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet,IonMenu, IonHeader, IonSplitPane, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { Platform } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { Observable } from 'rxjs';
import { LoggedUser } from './interfaces/loggedUser.interface';
import { TabsPage } from './tabs/tabs.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [CommonModule, TabsPage, IonApp, IonRouterOutlet, IonMenu, IonSplitPane, IonHeader, IonToolbar, IonTitle, IonContent, NavBarComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  public isMobile = false;
  public user$: Observable<LoggedUser | null>;
  
  private platform = inject(Platform);
  private auth = inject(AuthService);

  constructor() {
    this.user$ = this.auth.user$;
  }

  ngOnInit() {
    this.isMobile = this.platform.is('mobile') || this.platform.is('mobileweb');

    this.platform.resize.subscribe(() => {
      this.isMobile = this.platform.is('mobile') || this.platform.is('mobileweb');
    });
  }
}