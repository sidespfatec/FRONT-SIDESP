import { Routes } from '@angular/router';
import { HomeComponent } from './features/public/pages/home/home.component';
import { LoginComponent } from './features/public/pages/login/login.component';
import { RegistrationComponent } from './features/public/pages/registration/registration.component';
import { ManageTeachersComponent } from './features/admins/teacher/manage-teachers/manage.teachers.component';
import { ManageModalitesComponent } from './features/admins/modalites/manage-modalites.component';
import { ClassesComponent } from './features/admins/modalites/classes/classes.component';
import { ManageAdminComponent } from './features/admins/manage-admin/manage-admin.component';

export const routes: Routes = [

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
        component: ManageTeachersComponent
    },

    {
        path: 'manage-modalites',
        component: ManageModalitesComponent
    },

    {
        path: 'manage-modalites/:id/classes',
        component: ClassesComponent
    },

    {
        path: 'manage-admin',
        component: ManageAdminComponent
    }


];
