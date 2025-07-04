import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonCard, IonCardContent, IonList, IonItem, IonLabel, IonButton, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonSelect, IonSelectOption, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink,
    IonContent,
    IonCard, 
    IonCardContent, 
    IonButton, 
    IonCardHeader, 
    IonCardTitle, 
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

}
