import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/public/pages/login/login.component';
import { RegistrationComponent } from './features/public/pages/registration/registration.component';

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
        loadComponent: () => import('./features/admins/teacher/manage-teachers/manage.teachers.component').then(m => m.ManageTeachersComponent)
    },

    {
        path: 'manage-modalites',
        loadComponent: () => import('./features/admins/modalites/manage-modalites.component').then(m => m.ManageModalitesComponent)
    },

    {
        path: 'manage-modalites/:id/classes',
        loadComponent: () => import('./features/admins/modalites/classes/classes.component').then(m => m.ClassesComponent)
    },

    {
        path: 'manage-modalites/new-modality',
        loadComponent: () => import('./features/admins/modalites/new-modality/new-modality.component').then(m => m.NewModalityComponent)
    },

    {
        path: 'manage-admin',
        loadComponent: () => import('./features/admins/manage-admin/manage-admin.component').then(m => m.ManageAdminComponent)
    },

    {
        path: 'admin/mapa-calor',
        loadComponent: () => import('./features/admins/heat-map/heat-map.component').then(m => m.HeatMapComponent)
    },
    {
        path: 'admin/relatorios',
        loadComponent: () => import('./features/admins/reports/reports.component').then(m => m.ReportsComponent)
    },
    {
        path: 'admin/alunos',
        loadComponent: () => import('./features/admins/students/manage-students/manage-students.component').then(m => m.ManageStudentsComponent)
    },
    {
        path: 'admin/alunos/:id',
        loadComponent: () => import('./features/admins/students/student-file/student-file.component').then(m => m.StudentFileComponent)
    },
    {
        path: 'new-admin-modal',
        loadComponent: () => import('./features/admins/new-admin-modal/new-admin-modal.component').then(m => m.NewAdminModalComponent)
    },
    {
        path: 'new-admin-modal/:id',
        loadComponent: () => import('./features/admins/new-admin-modal/new-admin-modal.component').then(m => m.NewAdminModalComponent)
    },
    {
        path: 'manage-hubs',
        loadComponent: () => import('./features/admins/manage-hubs/manage-hubs.component').then(m => m.ManageHubsComponent)
    },
    {
        path: '**',
        redirectTo: 'home'
    }

];
