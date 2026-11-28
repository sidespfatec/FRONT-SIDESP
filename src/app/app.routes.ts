import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/public/pages/login/login.component';
import { RegistrationComponent } from './features/public/pages/registration/registration.component';
import { AdminsProfileComponent } from './features/admins/admins-profile/admins-profile.component';

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
        path: 'recuperar-senha',
        loadComponent: () => import('./features/public/pages/password-recovery/password-recovery.component').then(m => m.PasswordRecoveryComponent)
    },

    {
        path: 'registration',
        component: RegistrationComponent
    },

    {
        path: 'admins-profile',
        component: AdminsProfileComponent
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
        path: 'professor/turmas/:id',
        loadComponent: () => import('./features/teachers/class/class.component')
            .then(m => m.ClassComponent)
    },

    {
        path: 'professor',
        loadComponent: () => import('./features/teachers/profile/profile.component')
            .then(m => m.ProfileComponent)
    },
    {
        path: 'aluno/perfil',
        loadComponent: () => import('./features/admins/students/student-profile/student-profile.component').then(m => m.StudentProfileComponent)
    },

    {
        path: 'aluno/esportes',
        loadComponent: () => import('./features/admins/students/sports/sports.component').then(m => m.SportsComponent)
    },

    {
        path: 'aluno/esportes/:id',
        loadComponent: () => import('./features/admins/students/sports/sport-classes/sport-classes.component').then(m => m.SportClassesComponent)
    },

    {
        path: '**',
        redirectTo: 'home'
    }

];
