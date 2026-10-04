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

interface Teacher {
    id: number;
    name: string;
    modality: string;
}

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

    teachers: Teacher[] = [
        { id: 1, name: 'Ana Martins', modality: 'Judô' },
        { id: 2, name: 'Carlos Souza', modality: 'Futsal' },
        { id: 3, name: 'Bruna Lima', modality: 'Vôlei' },
        { id: 4, name: 'Carla Dias', modality: 'Natação' }
    ];

    openNew() {
        this.showModal = true;
    }

    edit(teacher: Teacher) {
        this.showModal = true;
    }

    delete(teacher: Teacher) {
        this.teachers = this.teachers.filter(
            item => item.id !== teacher.id
        );
    }
}