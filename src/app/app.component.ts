// app.component.ts

import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { Platform } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { LoggedUser } from './interfaces/loggedUser.interface';
import { TabsPage } from './tabs/tabs.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [CommonModule, TabsPage, IonApp, IonRouterOutlet, IonMenu, IonSplitPane, IonHeader, IonToolbar, IonTitle, IonContent, NavBarComponent],
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  public isMobile = false;
  public user$: Observable<LoggedUser | null>;
  
  private platform = inject(Platform);
  private auth = inject(AuthService);
  private resizeSubscription?: Subscription;

  constructor() {
    this.user$ = this.auth.user$;
    this.checkMobile();
  }

  ngOnInit() {
    this.resizeSubscription = this.platform.resize.subscribe(() => {
      this.checkMobile();
    });
  }

  ngOnDestroy() {
    this.resizeSubscription?.unsubscribe();
  }

  private checkMobile() {
    this.isMobile = this.platform.width() <= 700;
    
    console.log('Screen width:', this.platform.width());
    console.log('isMobile:', this.isMobile);
  }
}