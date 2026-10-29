import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { NewTeacherModalComponent } from '../new-teacher-modal/new-teacher-modal.component';

import { PROFESSORES_PROVISORIOS, Teacher } from '../teacher.model';
import { TeacherService } from '../teacher.service';

@Component({
    selector: 'app-manage-teachers',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent, NewTeacherModalComponent,
        AutoCompleteModule, ButtonModule, CardModule, ConfirmDialogModule,
        InputTextModule, TagModule, ToastModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './manage.teachers.component.html',
    styleUrl: './manage.teachers.component.scss'
})
export class ManageTeachersComponent implements OnInit {

    private teacherService = inject(TeacherService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    showModal = false;
    selecionado: Teacher | null = null;

    busca = signal('');
    carregando = signal(true);
    semApi = signal(false);
    teachers = signal<Teacher[]>([]);

    readonly professoresFiltrados = computed(() => {
        const termo = this.busca().trim().toLowerCase();
        if (!termo) { return this.teachers(); }

        return this.teachers().filter(professor =>
            professor.nome.toLowerCase().includes(termo)
            || professor.especialidade.toLowerCase().includes(termo)
        );
    });

    ngOnInit(): void {
        this.carregar();
    }

    carregar(): void {
        this.carregando.set(true);

        this.teacherService.listar().subscribe({
            next: lista => {
                this.teachers.set(lista);
                this.semApi.set(false);
                this.carregando.set(false);
            },
            error: (falha: HttpErrorResponse) => {
                this.teachers.set(PROFESSORES_PROVISORIOS);
                this.semApi.set(this.teacherService.endpointAusente(falha));
                this.carregando.set(false);
            }
        });
    }

    openNew(): void {
        this.selecionado = null;
        this.showModal = true;
    }

    edit(professor: Teacher): void {
        this.selecionado = professor;
        this.showModal = true;
    }

    aoSalvar(professor: Teacher): void {
        const lista = this.teachers();
        const posicao = lista.findIndex(item => item.id === professor.id);

        this.teachers.set(
            posicao >= 0
                ? lista.map(item => item.id === professor.id ? professor : item)
                : [professor, ...lista]
        );

        this.selecionado = null;
    }

    delete(professor: Teacher): void {
        this.confirmationService.confirm({
            header: 'Inativar professor',
            message: `${professor.nome} deixa de aparecer na lista, mas o histórico de turmas é preservado.`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Inativar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => this.inativar(professor)
        });
    }

    private inativar(professor: Teacher): void {
        this.teacherService.alterarSituacao(professor.id, false).subscribe({
            next: () => this.removerDaLista(professor),
            error: (falha: HttpErrorResponse) => {
                if (this.teacherService.endpointAusente(falha)) {
                    this.removerDaLista(professor);
                    return;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Não foi possível inativar',
                    detail: falha.error?.mensagem ?? 'Tente novamente em instantes.',
                    life: 5000
                });
            }
        });
    }

    private removerDaLista(professor: Teacher): void {
        this.teachers.set(this.teachers().filter(item => item.id !== professor.id));
        this.messageService.add({
            severity: 'success',
            summary: 'Professor inativado',
            detail: professor.nome,
            life: 4000
        });
    }
}
