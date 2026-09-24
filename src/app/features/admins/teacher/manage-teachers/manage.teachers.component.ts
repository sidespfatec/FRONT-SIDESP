import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { NewTeacherModalComponent } from '../new-teacher-modal/new-teacher-modal.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

@Component({
    selector: 'app-manage-teachers',
    standalone: true,
    imports: [
        CommonModule, BannerComponent,
        ButtonModule, InputTextModule, FooterComponent,
        AutoCompleteModule, CardModule, NewTeacherModalComponent, NavbarDesktopAdminComponent
    ],
    templateUrl: './manage.teachers.component.html',
    styleUrl: './manage.teachers.component.scss'
})
export class ManageTeachersComponent {

    showModal = false;
}