import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ImageModule } from 'primeng/image';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import {
    ALUNOS, Aluno, Documento, GENERO_OPCOES, GENERO_ROTULO, idadeDe, Matricula,
    pendenciasDe, turmasAtivasDe
} from '../student.model';

const TELEFONE = /^\(\d{2}\) \d{5}-\d{4}$/;

@Component({
    selector: 'app-student-file',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        ButtonModule, CardModule, IftaLabelModule, ImageModule, InputMaskModule,
        InputTextModule, MessageModule, SelectButtonModule, TabsModule, TagModule, ToastModule
    ],
    providers: [MessageService],
    templateUrl: './student-file.component.html',
    styleUrl: './student-file.component.scss'
})
export class StudentFileComponent {

    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);

    readonly generoOpcoes = GENERO_OPCOES;

    aluno = signal<Aluno | undefined>(undefined);
    editando = signal(false);

    form = this.fb.nonNullable.group({
        nome: ['', Validators.required],
        cpf: ['', Validators.required],
        nascimento: ['', Validators.required],
        genero: ['F', Validators.required],
        telefone: ['', Validators.pattern(TELEFONE)],
        cep: [''],
        rua: [''],
        numero: [''],
        complemento: [''],
        bairro: [''],
        cidade: [''],
        estado: [''],
        respNome: ['', Validators.required],
        respCpf: [''],
        respParentesco: [''],
        respTelefone: ['', [Validators.required, Validators.pattern(TELEFONE)]]
    });

    constructor() {
        const id = this.route.snapshot.paramMap.get('id');
        this.aluno.set(ALUNOS.find(aluno => aluno.id === id));
    }

    idade(aluno: Aluno): number {
        return idadeDe(aluno.nascimento);
    }

    genero(aluno: Aluno): string {
        return GENERO_ROTULO[aluno.genero];
    }

    pendencias(aluno: Aluno): number {
        return pendenciasDe(aluno);
    }

    turmasAtivas(aluno: Aluno): number {
        return turmasAtivasDe(aluno);
    }

    ruaENumero(aluno: Aluno): string {
        return `${aluno.endereco.rua}, ${aluno.endereco.numero}`;
    }

    cidadeEEstado(aluno: Aluno): string {
        return `${aluno.endereco.cidade}, ${aluno.endereco.estado}`;
    }

    quando(matricula: Matricula): string {
        return `${matricula.polo}, ${matricula.horario.toLowerCase()}, desde ${matricula.desde}`;
    }

    estadoDocumento(documento: Documento): string {
        if (documento.estado === 'faltando') { return 'Não enviado'; }
        if (documento.estado === 'vencido') {
            return `Enviado em ${documento.enviadoEm}, venceu em ${documento.venceEm}`;
        }
        return `Enviado em ${documento.enviadoEm}`;
    }

    editar(): void {
        const aluno = this.aluno();
        if (!aluno) { return; }

        this.form.setValue({
            nome: aluno.nome,
            cpf: aluno.cpf,
            nascimento: aluno.nascimento,
            genero: aluno.genero,
            telefone: aluno.telefone,
            cep: aluno.endereco.cep,
            rua: aluno.endereco.rua,
            numero: aluno.endereco.numero,
            complemento: aluno.endereco.complemento,
            bairro: aluno.endereco.bairro,
            cidade: aluno.endereco.cidade,
            estado: aluno.endereco.estado,
            respNome: aluno.responsavel.nome,
            respCpf: aluno.responsavel.cpf,
            respParentesco: aluno.responsavel.parentesco,
            respTelefone: aluno.responsavel.telefone
        });

        this.editando.set(true);
    }

    cancelar(): void {
        this.form.reset();
        this.editando.set(false);
    }

    salvar(): void {
        const aluno = this.aluno();
        if (!aluno) { return; }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Confira os campos',
                detail: 'Alguns dados estão incompletos.',
                life: 4000
            });
            return;
        }

        const dados = this.form.getRawValue();

        this.aluno.set({
            ...aluno,
            nome: dados.nome,
            cpf: dados.cpf,
            nascimento: dados.nascimento,
            genero: dados.genero === 'M' ? 'M' : 'F',
            telefone: dados.telefone,
            endereco: {
                cep: dados.cep,
                rua: dados.rua,
                numero: dados.numero,
                complemento: dados.complemento,
                bairro: dados.bairro,
                cidade: dados.cidade,
                estado: dados.estado
            },
            responsavel: {
                nome: dados.respNome,
                cpf: dados.respCpf,
                parentesco: dados.respParentesco,
                telefone: dados.respTelefone
            }
        });

        this.editando.set(false);
        this.messageService.add({
            severity: 'success',
            summary: 'Cadastro atualizado',
            detail: dados.nome,
            life: 4000
        });
    }

    invalido(campo: string): boolean {
        const controle = this.form.get(campo);
        return !!controle && controle.invalid && controle.touched;
    }

    voltar(): void {
        this.router.navigate(['/admin/alunos']);
    }

    trocarFoto(): void {
    }

    matricular(): void {
    }

    verDocumento(documento: Documento): void {
    }

    anexarDocumento(documento: Documento): void {
    }
}
