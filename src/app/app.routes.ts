import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { adminGuard } from './guard/admin.guard';
import { notStudentGuard } from './guard/not-student.guard';
import { studentGuard } from './guard/student.guard';
import { TabsPage } from './tabs/tabs.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';

export const routes: Routes = [
  // rotte senza navbar
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent) },
  { path: "no-role", loadComponent: () => import('./no-role/no-role.component').then((m) => m.NoRoleComponent) },

  // rotte mobile
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'plan', loadComponent: () => import('./plan/plan.component').then((m) => m.PlanComponent), canActivate: [studentGuard] },
      { path: 'request', loadComponent: () => import('./request/request.component').then((m) => m.RequestComponent), canActivate: [notStudentGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // rotte desktop
  {
    path: 'tabs',
    component: NavBarComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent) },
      { path: 'plan', loadComponent: () => import('./plan/plan.component').then((m) => m.PlanComponent), canActivate: [studentGuard] },
      { path: 'request', loadComponent: () => import('./request/request.component').then((m) => m.RequestComponent), canActivate: [notStudentGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: "admin-exams/:course_id", loadComponent: () => import('./admin-exams-results/admin-exams-results.component').then((m) => m.AdminExamsResultsComponent), 
    canActivate: [authGuard, adminGuard] 
  },

  { path: '', redirectTo: 'tabs', pathMatch: 'full' },


  // wild card
  { path: "**", loadComponent: () => import('./page-not-found/page-not-found.component').then((m) => m.PageNotFoundComponent) }
];