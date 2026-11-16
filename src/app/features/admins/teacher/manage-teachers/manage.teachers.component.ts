import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NewTeacherModalComponent } from '../new-teacher-modal/new-teacher-modal.component';

interface Teacher {
    id: number;
    name: string;
    modality: string;
    contractType: 'contratado' | 'concursado';
    active: boolean;
}

@Component({
    selector: 'app-manage-teachers',
    standalone: true,
    imports: [
        CommonModule, FormsModule, ButtonModule, InputTextModule, CardModule, SelectButtonModule, NewTeacherModalComponent
    ],
    templateUrl: './manage.teachers.component.html',
    styleUrl: './manage.teachers.component.scss'
})
export class ManageTeachersComponent {

    showModal = false;
    search = '';
    filter = 'active';

    filterOptions = [
        { label: 'Ativos', value: 'active' },
        { label: 'Inativos', value: 'inactive' }
    ];

    teachers: Teacher[] = [
        { id: 1, name: 'Ana Martins', modality: 'Judô', contractType: 'concursado', active: true },
        { id: 2, name: 'Carlos Souza', modality: 'Futsal', contractType: 'contratado', active: true },
        { id: 3, name: 'Bruna Lima', modality: 'Vôlei', contractType: 'concursado', active: true },
        { id: 4, name: 'Carla Dias', modality: 'Natação', contractType: 'contratado', active: true },
        { id: 5, name: 'Pedro Alves', modality: 'Basquete', contractType: 'contratado', active: false },
        { id: 6, name: 'Marina Costa', modality: 'Tênis', contractType: 'concursado', active: false }
    ];

    get filteredTeachers() {
        const text = this.search.toLowerCase();
        return this.teachers.filter(teacher =>
            teacher.active === (this.filter === 'active') &&
            teacher.name.toLowerCase().includes(text)
        );
    }

    initials(name: string) {
        const words = name.trim().split(' ');
        return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
    }

    openNew() {
        this.showModal = true;
    }

    edit(teacher: Teacher) {
        this.showModal = true;
    }

    toggleStatus(teacher: Teacher) {
        teacher.active = !teacher.active;
    }
}