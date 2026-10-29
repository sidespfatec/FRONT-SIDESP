
import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/public/pages/login/login.component';
import { RegistrationComponent } from './features/public/pages/registration/registration.component';
import { adminGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'manage-teachers',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/teacher/manage-teachers/manage.teachers.component')
        .then(m => m.ManageTeachersComponent)
  },
  {
    path: 'manage-modalites',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/modalites/manage-modalites.component')
        .then(m => m.ManageModalitesComponent)
  },
  {
    path: 'manage-modalites/:id/classes',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/modalites/classes/classes.component')
        .then(m => m.ClassesComponent)
  },
  {
    path: 'manage-modalites/new-modality',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/modalites/new-modality/new-modality.component')
        .then(m => m.NewModalityComponent)
  },
  {
    path: 'manage-admin',
    data: { roles: ['ADMINISTRADOR_TOTAL'] },
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/manage-admin/manage-admin.component')
        .then(m => m.ManageAdminComponent)
  },
  {
    path: 'admin/mapa-calor',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/heat-map/heat-map.component')
        .then(m => m.HeatMapComponent)
  },
  {
    path: 'admin/relatorios',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/reports/reports.component')
        .then(m => m.ReportsComponent)
  },
  {
    path: 'admin/alunos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/students/manage-students/manage-students.component')
        .then(m => m.ManageStudentsComponent)
  },
  {
    path: 'admin/alunos/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/students/student-file/student-file.component')
        .then(m => m.StudentFileComponent)
  },
  {
    path: 'new-admin-modal',
    data: { roles: ['ADMINISTRADOR_TOTAL'] },
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/new-admin-modal/new-admin-modal.component')
        .then(m => m.NewAdminModalComponent)
  },
  {
    path: 'new-admin-modal/:id',
    data: { roles: ['ADMINISTRADOR_TOTAL'] },
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/new-admin-modal/new-admin-modal.component')
        .then(m => m.NewAdminModalComponent)
  },
  {
    path: 'manage-hubs',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/manage-hubs/manage-hubs.component')
        .then(m => m.ManageHubsComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
