import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) },

  { path: 'home', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent), canActivate: [authGuard] },
  { path: "dashboard", loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent), canActivate: [authGuard] },
  { path: "plan", loadComponent: () => import('./plan/plan.component').then((m) => m.PlanComponent), canActivate: [authGuard] },
  { path: "request", loadComponent: () => import('./request/request.component').then((m) => m.RequestComponent), canActivate: [authGuard] },
  { path: "admin-exams/:course_id", loadComponent: () => import('./admin-exams-results/admin-exams-results.component').then((m) => m.AdminExamsResultsComponent), canActivate: [authGuard] },
  
  
  { path: "no-role", loadComponent: () => import('./no-role/no-role.component').then((m) => m.NoRoleComponent) },
  { path: "**", loadComponent: () => import('./page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent) }    // wild card routing: se nessuna route sopra matcha con la url richiesta allora attiva questo path
  
];
