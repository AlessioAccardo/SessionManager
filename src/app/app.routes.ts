import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { adminGuard } from './guard/admin.guard';
import { notStudentGuard } from './guard/not-student.guard';
import { studentGuard } from './guard/student.guard';
import { TabsPage } from './tabs/tabs.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

export const routes: Routes = [
  // Rotte che NON hanno la barra di navigazione principale (es. login)
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) 
  },
  { 
    path: "no-role", 
    loadComponent: () => import('./no-role/no-role.component').then((m) => m.NoRoleComponent) 
  },

  // Rotta "CONTENITORE" per tutto ciò che usa la navigazione (desktop o mobile/tabs)
  // Per mobile, questa rotta caricherà il layout TabsPage.
  // Per desktop, il layout è gestito da app.component.html.
  {
    path: 'tabs',
    component: TabsPage, // Per mobile, questo componente fornisce il layout con la tab-bar
    canActivate: [authGuard], // La protezione generale va qui
    children: [
      // Queste sono le pagine che verranno caricate DENTRO il layout delle tabs
      { 
        path: 'home', // L'URL completo sarà /tabs/home
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) 
      },
      { 
        path: 'dashboard', // L'URL completo sarà /tabs/dashboard
        loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent) 
      },
      { 
        path: 'plan', // L'URL completo sarà /tabs/plan
        loadComponent: () => import('./plan/plan.component').then((m) => m.PlanComponent), 
        canActivate: [studentGuard] // Le guardie specifiche rimangono qui
      },
      { 
        path: 'request', // L'URL completo sarà /tabs/request
        loadComponent: () => import('./request/request.component').then((m) => m.RequestComponent), 
        canActivate: [notStudentGuard] 
      },
      // Redirezione di default per il percorso /tabs
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },


   {
    path: 'tabs',
    component: NavBarComponent, // Per mobile, questo componente fornisce il layout con la tab-bar
    canActivate: [authGuard], // La protezione generale va qui
    children: [
      // Queste sono le pagine che verranno caricate DENTRO il layout delle tabs
      { 
        path: 'home', // L'URL completo sarà /tabs/home
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) 
      },
      { 
        path: 'dashboard', // L'URL completo sarà /tabs/dashboard
        loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent) 
      },
      { 
        path: 'plan', // L'URL completo sarà /tabs/plan
        loadComponent: () => import('./plan/plan.component').then((m) => m.PlanComponent), 
        canActivate: [studentGuard] // Le guardie specifiche rimangono qui
      },
      { 
        path: 'request', // L'URL completo sarà /tabs/request
        loadComponent: () => import('./request/request.component').then((m) => m.RequestComponent), 
        canActivate: [notStudentGuard] 
      },
      // Redirezione di default per il percorso /tabs
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },


  // Rotte specifiche che potrebbero NON usare il layout a schede (anche se l'utente è loggato)
  { 
    path: "admin-exams/:course_id", 
    loadComponent: () => import('./admin-exams-results/admin-exams-results.component').then((m) => m.AdminExamsResultsComponent), 
    canActivate: [authGuard, adminGuard] 
  },

  // Redirezione di default dell'applicazione: manda sempre al layout delle tabs
  { 
    path: '', 
    redirectTo: 'tabs', 
    pathMatch: 'full' 
  },
  
  // Wild card alla fine
  { 
    path: "**", 
    loadComponent: () => import('./page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent) 
  }
];