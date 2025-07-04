import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton } from '@ionic/angular/standalone'

@Component({
  selector: 'app-no-role',
  standalone: true,
  templateUrl: './no-role.component.html',
  styleUrls: ['./no-role.component.scss'],
  imports: [RouterLink, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton]
})
export class NoRoleComponent {
  constructor() {}
}
