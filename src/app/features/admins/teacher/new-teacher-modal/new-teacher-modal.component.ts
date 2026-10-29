import { Component, EventEmitter, inject, Input, OnChanges, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { ApiErro } from '../../../../core/http/api-erro.model';
import { Modalidade, MODALIDADES_PROVISORIAS, Teacher, TeacherPayload } from '../teacher.model';
import { TeacherService } from '../teacher.service';

@Component({
    selector: 'app-new-teacher-modal',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        ButtonModule, DialogModule, FileUploadModule, InputMaskModule, InputTextModule, SelectModule
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

    salvando = signal(false);
    modalidades = signal<Modalidade[]>(MODALIDADES_PROVISORIAS);
    curriculo: File | null = null;

    form = this.fb.nonNullable.group({
        nome: ['', [Validators.required, Validators.minLength(3)]],
        cpf: ['', Validators.required],
        dataNascimento: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telefone: ['', Validators.required],
        registroProfissional: [''],
        cep: [''],
        rua: [''],
        numero: [''],
        complemento: [''],
        bairro: [''],
        cidade: [''],
        estado: ['SP'],
        modalidadeId: [null as number | null, Validators.required]
    });

    ngOnChanges(): void {
        this.carregarModalidades();

        if (!this.visible) { return; }

        if (this.professor) {
            this.preencher(this.professor);
        } else {
            this.form.reset({ estado: 'SP' });
            this.curriculo = null;
        }
    }

    get titulo(): string {
        return this.professor ? 'Editar professor' : 'Novo professor';
    }

    aoEscolherCurriculo(evento: { currentFiles: File[] }): void {
        this.curriculo = evento.currentFiles?.[0] ?? null;
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

        const payload = this.montarPayload(this.professor?.pesId ?? null);

        const requisicao = this.professor
            ? this.teacherService.atualizar(this.professor.id, payload)
            : this.teacherService.criar(payload);

        this.salvando.set(true);

        requisicao.subscribe({
            next: professor => this.aposSalvar(professor),
            error: (falha: HttpErrorResponse) => {
                if (this.teacherService.apiIndisponivel(falha)) {
                    this.aposSalvar(this.montarLocal(payload));
                    return;
                }

                this.salvando.set(false);
                this.tratarErro(falha);
            }
        });
    }

    onCancel(): void {
        this.fechar();
    }

    fechar(): void {
        this.form.reset({ estado: 'SP' });
        this.curriculo = null;
        this.visible = false;
        this.visibleChange.emit(false);
    }

    erro(campo: string): string | null {
        const controle = this.form.get(campo);
        if (!controle || !controle.touched || !controle.errors) { return null; }
        if (controle.errors['servidor']) { return controle.errors['servidor'] as string; }
        if (controle.errors['required']) { return 'Campo obrigatório.'; }
        if (controle.errors['email']) { return 'E-mail inválido.'; }
        if (controle.errors['minlength']) { return 'Nome muito curto.'; }
        return 'Valor inválido.';
    }

    private carregarModalidades(): void {
        this.teacherService.listarModalidades().subscribe({
            next: lista => {
                if (lista?.length) { this.modalidades.set(lista); }
            },
            error: () => this.modalidades.set(MODALIDADES_PROVISORIAS)
        });
    }

    private preencher(professor: Teacher): void {
        this.form.setValue({
            nome: professor.nome,
            cpf: professor.cpf,
            dataNascimento: professor.dataNascimento,
            email: professor.email,
            telefone: professor.telefone,
            registroProfissional: professor.registroProfissional ?? '',
            cep: professor.endereco?.cep ?? '',
            rua: professor.endereco?.rua ?? '',
            numero: professor.endereco?.numero ?? '',
            complemento: professor.endereco?.complemento ?? '',
            bairro: professor.endereco?.bairro ?? '',
            cidade: professor.endereco?.cidade ?? '',
            estado: professor.endereco?.estado ?? 'SP',
            modalidadeId: professor.modalidades?.[0]?.id ?? null
        });
        this.curriculo = null;
    }

    private aposSalvar(professor: Teacher): void {
        if (!this.curriculo) {
            this.concluir(professor);
            return;
        }

        this.teacherService.enviarCurriculo(professor.id, this.curriculo).subscribe({
            next: atualizado => this.concluir(atualizado),
            error: (falha: HttpErrorResponse) => {
                if (!this.teacherService.apiIndisponivel(falha)) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Professor salvo, currículo não',
                        detail: 'O cadastro foi criado, mas o PDF não subiu.',
                        life: 7000
                    });
                }
                this.concluir(professor);
            }
        });
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

    private montarPayload(pesId: number | null): TeacherPayload {
        const dados = this.form.getRawValue();

        return {
            pesId,
            nome: dados.nome.trim(),
            cpf: this.soNumeros(dados.cpf),
            dataNascimento: dados.dataNascimento,
            email: dados.email.trim().toLowerCase(),
            telefone: this.soNumeros(dados.telefone),
            registroProfissional: dados.registroProfissional.trim() || null,
            endereco: {
                cep: this.soNumeros(dados.cep),
                rua: dados.rua.trim(),
                numero: dados.numero.trim(),
                complemento: dados.complemento.trim() || null,
                bairro: dados.bairro.trim(),
                cidade: dados.cidade.trim(),
                estado: dados.estado.trim().toUpperCase()
            },
            modalidadeIds: dados.modalidadeId ? [dados.modalidadeId] : []
        };
    }

    private montarLocal(payload: TeacherPayload): Teacher {
        const escolhida = this.modalidades().find(item => item.id === payload.modalidadeIds[0]);

        return {
            id: this.professor?.id ?? Date.now(),
            pesId: payload.pesId,
            nome: payload.nome,
            cpf: payload.cpf,
            dataNascimento: payload.dataNascimento,
            email: payload.email,
            telefone: payload.telefone,
            registroProfissional: payload.registroProfissional,
            endereco: payload.endereco,
            modalidades: escolhida ? [escolhida] : [],
            curriculoUrl: null,
            ativo: true
        };
    }

    private tratarErro(falha: HttpErrorResponse): void {
        const corpo = falha.error as ApiErro | null;

        if (falha.status === 409 && corpo?.pesId && !corpo.jaEhProfessor) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Pessoa já cadastrada',
                detail: `${corpo.nome} já existe no sistema. Confirme para cadastrar como professor.`,
                life: 8000
            });
            return;
        }

        if (corpo?.campos) {
            Object.entries(corpo.campos).forEach(([campo, mensagem]) => {
                const controle = this.form.get(this.mapearCampo(campo));
                controle?.setErrors({ servidor: mensagem });
                controle?.markAsTouched();
            });
        }

        this.messageService.add({
            severity: 'error',
            summary: 'Não foi possível salvar',
            detail: corpo?.mensagem ?? 'Tente novamente em instantes.',
            life: 6000
        });
    }

    private mapearCampo(campo: string): string {
        return campo.startsWith('endereco.') ? campo.replace('endereco.', '') : campo;
    }

    private soNumeros(valor: string): string {
        return (valor ?? '').replace(/\D/g, '');
    }
}
