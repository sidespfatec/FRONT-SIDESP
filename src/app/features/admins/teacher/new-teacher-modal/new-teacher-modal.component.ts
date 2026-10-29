import { Component, EventEmitter, inject, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';

import {
    ApiErro, ESPECIALIDADES, SEXO_OPCOES, Sexo, Teacher, TeacherPayload
} from '../teacher.model';
import { TeacherService } from '../teacher.service';

@Component({
    selector: 'app-new-teacher-modal',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        ButtonModule, DialogModule, InputMaskModule, InputTextModule,
        SelectModule, SelectButtonModule
    ],
    templateUrl: './new-teacher-modal.component.html',
    styleUrl: './new-teacher-modal.component.scss'
})
export class NewTeacherModalComponent implements OnChanges {

    @Input() visible = false;
    @Input() professor: Teacher | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() salvo = new EventEmitter<Teacher>();

    private fb = inject(FormBuilder);
    private teacherService = inject(TeacherService);
    private messageService = inject(MessageService);

    readonly sexoOpcoes = SEXO_OPCOES;
    readonly especialidades = ESPECIALIDADES;

    salvando = signal(false);

    form = this.fb.nonNullable.group({
        nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
        cpf: ['', Validators.required],
        dataNascimento: ['', Validators.required],
        sexo: ['F' as Sexo, Validators.required],
        telefone: ['', Validators.required],
        registroProfissional: ['', [Validators.required, Validators.maxLength(50)]],
        especialidade: ['', [Validators.required, Validators.maxLength(100)]]
    });

    ngOnChanges(): void {
        if (!this.visible) { return; }

        if (this.professor) {
            this.form.setValue({
                nome: this.professor.nome,
                cpf: this.professor.cpf,
                dataNascimento: this.professor.dataNascimento,
                sexo: this.professor.sexo,
                telefone: this.professor.telefone,
                registroProfissional: this.professor.registroProfissional,
                especialidade: this.professor.especialidade
            });
        } else {
            this.form.reset({ sexo: 'F' });
        }
    }

    get titulo(): string {
        return this.professor ? 'Editar professor' : 'Novo professor';
    }

    salvar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Confira os campos',
                detail: 'Alguns dados obrigatórios estão faltando.',
                life: 4000
            });
            return;
        }

        const payload = this.montarPayload();
        this.salvando.set(true);

        if (this.professor) {
            this.teacherService.atualizar(this.professor.id, payload).subscribe({
                next: professor => this.concluir(professor),
                error: (falha: HttpErrorResponse) => this.aoFalhar(falha, payload, this.professor!.id)
            });
            return;
        }

        this.teacherService.cadastrar(payload).subscribe({
            next: resultado => this.concluir(this.montarLocal(payload, resultado.id)),
            error: (falha: HttpErrorResponse) => this.aoFalhar(falha, payload, Date.now())
        });
    }

    onCancel(): void {
        this.fechar();
    }

    fechar(): void {
        this.form.reset({ sexo: 'F' });
        this.visible = false;
        this.visibleChange.emit(false);
    }

    erro(campo: string): string | null {
        const controle = this.form.get(campo);
        if (!controle || !controle.touched || !controle.errors) { return null; }
        if (controle.errors['servidor']) { return controle.errors['servidor'] as string; }
        if (controle.errors['required']) { return 'Campo obrigatório.'; }
        if (controle.errors['minlength']) { return 'Muito curto.'; }
        if (controle.errors['maxlength']) { return 'Passou do tamanho permitido.'; }
        return 'Valor inválido.';
    }

    private aoFalhar(falha: HttpErrorResponse, payload: TeacherPayload, id: number): void {
        if (this.teacherService.endpointAusente(falha)) {
            this.concluir(this.montarLocal(payload, id));
            return;
        }

        this.salvando.set(false);
        this.tratarErro(falha);
    }

    private concluir(professor: Teacher): void {
        this.salvando.set(false);
        this.messageService.add({
            severity: 'success',
            summary: this.professor ? 'Professor atualizado' : 'Professor cadastrado',
            detail: professor.nome,
            life: 4000
        });
        this.salvo.emit(professor);
        this.fechar();
    }

    private montarPayload(): TeacherPayload {
        const dados = this.form.getRawValue();

        return {
            nome: dados.nome.trim(),
            cpf: this.soNumeros(dados.cpf),
            dataNascimento: dados.dataNascimento,
            sexo: dados.sexo,
            telefone: this.soNumeros(dados.telefone),
            registroProfissional: dados.registroProfissional.trim(),
            especialidade: dados.especialidade.trim()
        };
    }

    private montarLocal(payload: TeacherPayload, id: number): Teacher {
        return { id, ...payload, ativo: true };
    }

    private tratarErro(falha: HttpErrorResponse): void {
        const corpo = falha.error as ApiErro | null;

        if (falha.status === 403) {
            this.messageService.add({
                severity: 'error',
                summary: 'Sem permissão',
                detail: 'Só um administrador total pode cadastrar professores.',
                life: 6000
            });
            return;
        }

        if (falha.status === 401) {
            this.messageService.add({
                severity: 'error',
                summary: 'Sessão expirada',
                detail: 'Entre de novo para continuar.',
                life: 6000
            });
            return;
        }

        if (corpo?.errosCampos) {
            Object.entries(corpo.errosCampos).forEach(([campo, mensagem]) => {
                const controle = this.form.get(campo);
                controle?.setErrors({ servidor: mensagem });
                controle?.markAsTouched();
            });
        }

        this.messageService.add({
            severity: 'error',
            summary: corpo?.codigo === 'CADASTRO_EXISTENTE' ? 'CPF já cadastrado' : 'Não foi possível salvar',
            detail: corpo?.mensagem ?? 'Tente novamente em instantes.',
            life: 7000
        });
    }

    private soNumeros(valor: string): string {
        return (valor ?? '').replace(/\D/g, '');
    }
}
