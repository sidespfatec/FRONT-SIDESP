import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfessionalService } from '../../professionals/services/professional.service';
import { ProfessionalSummary } from '../../../../core/models/management.models';
import { Component, inject } from '@angular/core';
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
        CommonModule, FormsModule, BannerComponent,
        ButtonModule, InputTextModule, FooterComponent,
        AutoCompleteModule, CardModule, NewTeacherModalComponent, NavbarDesktopAdminComponent
    ],
    templateUrl: './manage.teachers.component.html',
    styleUrl: './manage.teachers.component.scss'
})
export class ManageTeachersComponent {
    private changeDetector = inject(ChangeDetectorRef);

    showModal = false;

    private api = inject(ProfessionalService);
    teachers: (Teacher & {active: boolean; source: ProfessionalSummary})[] = [];
    search = '';
    busy = false;
    errorMessage = '';
    selected: ProfessionalSummary | null = null;
    ngOnInit() { this.load(); }
    load() {
        this.busy = true;
        this.api.teachers().pipe(finalize(() => { this.busy = false; this.changeDetector.markForCheck(); })).subscribe({
            next: rows => this.teachers = rows.map(t => ({id: t.id, name: t.nome,
                modality: t.especialidade || 'Não informada', active: t.ativo, source: t})),
            error: e => this.errorMessage = e.error?.mensagem || 'Não foi possível carregar os professores.'
        });
    }
    get filteredTeachers() {
        return this.teachers.filter(t => t.name.toLocaleLowerCase('pt-BR').includes(this.search.trim().toLocaleLowerCase('pt-BR')));
    }
    openNew() { this.selected = null; this.showModal = true; }
    edit(teacher: Teacher) {
        this.selected = this.teachers.find(t => t.id === teacher.id)?.source || null;
        this.showModal = true;
    }
    delete(teacher: Teacher) {
        const row = this.teachers.find(t => t.id === teacher.id);
        if (!row || this.busy) return;
        this.busy = true;
        this.api.status('professores', row.id, !row.active).pipe(finalize(() => { this.busy = false; this.changeDetector.markForCheck(); })).subscribe({
            next: () => this.load(),
            error: e => this.errorMessage = e.error?.mensagem || 'Não foi possível alterar a situação.'
        });
    }
}
