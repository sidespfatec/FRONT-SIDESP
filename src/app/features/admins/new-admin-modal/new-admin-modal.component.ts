import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

import { Administrador, ModoFicha, NIVEIS_PERMISSAO } from '../admin.model';

@Component({
    selector: 'app-new-admin-modal',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        DialogModule, InputTextModule, InputMaskModule, DatePickerModule, SelectModule,
        PasswordModule, ToggleSwitchModule, TagModule, ButtonModule
    ],
    templateUrl: './new-admin-modal.component.html',
    styleUrl: './new-admin-modal.component.scss'
})
export class NewAdminModalComponent implements OnChanges {
    @Input() visible = false;
    @Input() modo: ModoFicha = 'ver';
    @Input() admin: Administrador | null = null;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() salvar = new EventEmitter<Administrador>();
    @Output() editar = new EventEmitter<void>();
    @Output() desativar = new EventEmitter<void>();
    @Output() redefinirSenha = new EventEmitter<void>();

    private readonly fb = inject(FormBuilder);

    readonly niveis = NIVEIS_PERMISSAO;
    readonly hoje = new Date();

    readonly form = this.fb.nonNullable.group({
        nome: ['', [Validators.required, Validators.minLength(3)]],
        cpf: ['', Validators.required],
        rg: [''],
        nascimento: [null as Date | null],
        email: ['', [Validators.required, Validators.email]],
        telefone: [''],
        cidade: [''],
        nivel: ['', Validators.required],
        cargo: [''],
        unidade: [''],
        admissao: [null as Date | null],
        senha: [''],
        doisFatores: [true]
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['admin'] || changes['modo'] || changes['visible']) {
            this.modo === 'novo' ? this.limpar() : this.preencher(this.admin);
        }
    }

    get readOnly(): boolean {
        return this.modo === 'ver';
    }

    get titulo(): string {
        if (this.modo === 'novo') { return 'Novo administrador'; }
        if (this.modo === 'editar') { return 'Editar administrador'; }
        return this.admin?.nome ?? 'Administrador';
    }

    get secoes() {
        const a = this.admin;
        if (!a) { return []; }
        const data = (d: Date | null) => d ? d.toLocaleDateString('pt-BR') : '';
        return [
            {
                titulo: 'Dados pessoais',
                itens: [
                    { rotulo: 'CPF', valor: a.cpf },
                    { rotulo: 'RG', valor: a.rg },
                    { rotulo: 'Nascimento', valor: data(a.nascimento) }
                ]
            },
            {
                titulo: 'Contato',
                itens: [
                    { rotulo: 'E-mail', valor: a.email },
                    { rotulo: 'Telefone', valor: a.telefone },
                    { rotulo: 'Cidade', valor: a.cidade }
                ]
            },
            {
                titulo: 'Acesso',
                itens: [
                    { rotulo: 'Nível de permissão', valor: a.nivel },
                    { rotulo: 'Cargo', valor: a.cargo },
                    { rotulo: 'Unidade', valor: a.unidade },
                    { rotulo: 'Admissão', valor: data(a.admissao) },
                    { rotulo: 'Dois fatores', valor: a.doisFatores ? 'Exigida' : 'Não exigida' },
                    { rotulo: 'Cadastrado por', valor: a.cadastradoPor }
                ]
            }
        ];
    }

    invalido(campo: string): boolean {
        const controle = this.form.get(campo);
        return !!controle && controle.invalid && (controle.dirty || controle.touched);
    }

    enviar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const v = this.form.getRawValue();
        this.salvar.emit({
            id: this.admin?.id ?? 0,
            nome: v.nome,
            cpf: v.cpf,
            rg: v.rg,
            nascimento: v.nascimento,
            email: v.email,
            telefone: v.telefone,
            cidade: v.cidade,
            nivel: v.nivel as Administrador['nivel'],
            cargo: v.cargo,
            unidade: v.unidade,
            admissao: v.admissao,
            doisFatores: v.doisFatores,
            ativo: this.admin?.ativo ?? true,
            cadastradoPor: this.admin?.cadastradoPor
        });
    }

    cancelar(): void {
        if (this.modo === 'editar' && this.admin) {
            this.preencher(this.admin);
            this.modo = 'ver';
            return;
        }
        this.fechar();
    }

    fechar(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    private preencher(admin: Administrador | null): void {
        if (!admin) { this.limpar(); return; }
        this.form.reset({
            nome: admin.nome,
            cpf: admin.cpf,
            rg: admin.rg ?? '',
            nascimento: admin.nascimento,
            email: admin.email,
            telefone: admin.telefone,
            cidade: admin.cidade,
            nivel: admin.nivel,
            cargo: admin.cargo,
            unidade: admin.unidade,
            admissao: admin.admissao,
            senha: '',
            doisFatores: admin.doisFatores
        });
    }

    private limpar(): void {
        this.form.reset({
            nome: '', cpf: '', rg: '', nascimento: null, email: '', telefone: '', cidade: '',
            nivel: '', cargo: '', unidade: '', admissao: null, senha: '', doisFatores: true
        });
    }
}