import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NewTeacherModalComponent } from '../new-teacher-modal/new-teacher-modal.component';
import { TeacherAdminService } from '../teacher.service';

interface Teacher {
    id: number;
    name: string;
    modality: string;
    cargo: string;
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
export class ManageTeachersComponent implements OnInit {

    private readonly service = inject(TeacherAdminService);

    readonly carregando = this.service.carregando;
    readonly erro = this.service.erro;

    showModal = false;
    search = '';
    filter = 'active';

    filterOptions = [
        { label: 'Ativos', value: 'active' },
        { label: 'Inativos', value: 'inactive' }
    ];

    ngOnInit(): void {
        this.service.buscarProfessores();
    }

    get filteredTeachers(): Teacher[] {
        const text = this.search.toLowerCase();
        return this.service.professores()
            .filter(professor =>
                professor.ativo === (this.filter === 'active') &&
                professor.nome.toLowerCase().includes(text)
            )
            .map(professor => ({
                id: professor.id,
                name: professor.nome,
                modality: professor.especialidade ?? '—',
                cargo: professor.cargo ?? '',
                active: professor.ativo
            }));
    }

    recarregar() {
        this.service.buscarProfessores();
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
        this.service.alterarSituacao(teacher.id, !teacher.active).subscribe({
            next: () => this.recarregar(),
            error: () => this.recarregar()
        });
    }
}
