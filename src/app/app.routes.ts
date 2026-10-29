import { adminGuard, authGuard } from './core/auth/auth.guard';
import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/public/pages/login/login.component';
import { RegistrationComponent } from './features/public/pages/registration/registration.component';

export const routes: Routes = [
  {
    path: 'fichas-medicas',
    canActivate: [adminGuard],
    data: { roles: ['ADMINISTRADOR_TOTAL', 'ADMINISTRADOR_PARCIAL', 'PROFESSOR'] },
    loadComponent: () =>
      import('./features/account/medical.component').then((m) => m.MedicalComponent),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/account/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'dependentes/novo',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/account/dependent.component').then((m) => m.DependentComponent),
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'registration',
    component: RegistrationComponent,
  },

  {
    path: 'manage-teachers',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/teacher/manage-teachers/manage.teachers.component').then(
        (m) => m.ManageTeachersComponent,
      ),
  },

  {
    path: 'manage-modalites',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/modalites/manage-modalites.component').then(
        (m) => m.ManageModalitesComponent,
      ),
  },

  {
    path: 'manage-modalites/:id/classes',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/modalites/classes/classes.component').then(
        (m) => m.ClassesComponent,
      ),
  },

  {
    path: 'manage-modalites/new-modality',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/modalites/new-modality/new-modality.component').then(
        (m) => m.NewModalityComponent,
      ),
  },

  {
    path: 'manage-admin',
    canActivate: [adminGuard],
    data: { roles: ['ADMINISTRADOR_TOTAL'] },
    loadComponent: () =>
      import('./features/admins/manage-admin/manage-admin.component').then(
        (m) => m.ManageAdminComponent,
      ),
  },

  {
    path: 'admin/mapa-calor',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/heat-map/heat-map.component').then((m) => m.HeatMapComponent),
  },
  {
    path: 'admin/relatorios',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/reports/reports.component').then((m) => m.ReportsComponent),
  },
  {
    path: 'admin/alunos',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/students/manage-students/manage-students.component').then(
        (m) => m.ManageStudentsComponent,
      ),
  },
  {
    path: 'admin/alunos/:id',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/students/student-file/student-file.component').then(
        (m) => m.StudentFileComponent,
      ),
  },
  {
    path: 'new-admin-modal',
    canActivate: [adminGuard],
    data: { roles: ['ADMINISTRADOR_TOTAL'] },
    loadComponent: () =>
      import('./features/admins/manage-admin/manage-admin.component').then(
        (m) => m.ManageAdminComponent,
      ),
  },
  {
    path: 'new-admin-modal/:id',
    canActivate: [adminGuard],
    data: { roles: ['ADMINISTRADOR_TOTAL'] },
    loadComponent: () =>
      import('./features/admins/manage-admin/manage-admin.component').then(
        (m) => m.ManageAdminComponent,
      ),
  },
  {
    path: 'manage-hubs',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admins/manage-hubs/manage-hubs.component').then(
        (m) => m.ManageHubsComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
