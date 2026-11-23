import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

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
import { AdministradorCriado, NivelAcesso, NIVEIS_ACESSO, NovoAdministrador } from '../admin-management.model';
import { AdminManagementService } from '../admin-management.service';
import { GENEROS, maiorDeIdade, SENHA_MIN, UFS } from '../registration.model';

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
    @Output() salvo = new EventEmitter<AdministradorCriado>();
    @Output() editar = new EventEmitter<void>();
    @Output() desativar = new EventEmitter<void>();
    @Output() redefinirSenha = new EventEmitter<void>();

    private readonly fb = inject(FormBuilder);

    private readonly service = inject(AdminManagementService);

    //a resposta chega fora de um evento: precisa ser signal para a tela repintar
    readonly salvando = signal(false);
    readonly erro = signal<string | null>(null);

    readonly niveis = NIVEIS_PERMISSAO;
    readonly niveisAcesso = NIVEIS_ACESSO;
    readonly generos = GENEROS;
    readonly ufs = UFS;
    readonly senhaMin = SENHA_MIN;
    readonly hoje = new Date();

    readonly form = this.fb.nonNullable.group({
        nome: ['', [Validators.required, Validators.minLength(3)]],
        cpf: ['', Validators.required],
        rg: [''],
        nascimento: [null as Date | null],
        genero: [''],
        email: ['', [Validators.required, Validators.email]],
        telefone: [''],
        cep: [''],
        rua: [''],
        numero: [''],
        complemento: [''],
        bairro: [''],
        cidade: [''],
        uf: [''],
        nivel: ['', Validators.required],
        cargo: [''],
        unidade: [''],
        admissao: [null as Date | null],
        senha: [''],
        confirmacaoSenha: [''],
        doisFatores: [true]
    });

    //só o cadastro novo manda dados para a API, então as exigências dela valem só nesse modo
    private readonly camposDoCadastro = [
        'nascimento', 'genero', 'telefone', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf', 'confirmacaoSenha'
    ];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['admin'] || changes['modo'] || changes['visible']) {
            this.erro.set(null);
            this.ajustarExigencias();
            this.modo === 'novo' ? this.limpar() : this.preencher(this.admin);
        }
    }

    private ajustarExigencias(): void {
        const novo = this.modo === 'novo';

        for (const campo of this.camposDoCadastro) {
            const controle = this.form.get(campo)!;
            novo ? controle.addValidators(Validators.required) : controle.clearValidators();
            controle.updateValueAndValidity({ emitEvent: false });
        }

        const senha = this.form.controls.senha;
        novo
            ? senha.addValidators([Validators.required, Validators.minLength(SENHA_MIN)])
            : senha.clearValidators();
        senha.updateValueAndValidity({ emitEvent: false });
    }

    get opcoesNivel() {
        return this.modo === 'novo' ? this.niveisAcesso : this.niveis;
    }

    get maiorDeIdade(): boolean {
        return maiorDeIdade(this.dataIso(this.form.controls.nascimento.value) ?? '');
    }

    get senhasConferem(): boolean {
        return this.form.controls.senha.value === this.form.controls.confirmacaoSenha.value;
    }

    get podeCadastrar(): boolean {
        return this.form.valid && this.maiorDeIdade && this.senhasConferem && !this.salvando();
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

        if (this.modo === 'novo') {
            this.cadastrar();
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

    private cadastrar(): void {
        if (!this.podeCadastrar) { return; }

        this.salvando.set(true);
        this.erro.set(null);

        this.service.cadastrarAdministrador(this.montarCorpo()).subscribe({
            next: (criado) => {
                this.salvando.set(false);
                this.salvo.emit(criado);
                this.limpar();
                this.fechar();
            },
            error: (falha: HttpErrorResponse) => {
                this.salvando.set(false);
                this.erro.set(this.service.explicarErro(falha));
            }
        });
    }

    /** Monta o corpo no formato aninhado que o POST espera. */
    private montarCorpo(): NovoAdministrador {
        const v = this.form.getRawValue();

        return {
            cadastro: {
                dadosPessoais: {
                    nome: v.nome.trim(),
                    cpf: v.cpf.trim(),
                    dataNascimento: this.dataIso(v.nascimento)!,
                    genero: v.genero as 'M' | 'F',
                    telefone: v.telefone.trim()
                },
                endereco: {
                    cep: v.cep.trim(),
                    rua: v.rua.trim(),
                    numero: v.numero.trim(),
                    complemento: v.complemento.trim(),
                    bairro: v.bairro.trim(),
                    cidade: v.cidade.trim(),
                    uf: v.uf
                },
                credenciais: {
                    email: v.email.trim(),
                    senha: v.senha,
                    confirmacaoSenha: v.confirmacaoSenha,
                    cpfLogin: v.cpf.trim()
                }
            },
            nivel: v.nivel as NivelAcesso,
            rg: v.rg.trim(),
            cargo: v.cargo.trim(),
            unidade: v.unidade.trim(),
            admissao: this.dataIso(v.admissao)
        };
    }

    /** O back espera a data como texto 'aaaa-mm-dd'. */
    private dataIso(data: Date | null): string | undefined {
        if (!data) { return undefined; }
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return `${data.getFullYear()}-${mes}-${dia}`;
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
            genero: '',
            email: admin.email,
            telefone: admin.telefone,
            cep: '', rua: '', numero: '', complemento: '', bairro: '', uf: '',
            cidade: admin.cidade,
            nivel: admin.nivel,
            cargo: admin.cargo,
            unidade: admin.unidade,
            admissao: admin.admissao,
            senha: '',
            confirmacaoSenha: '',
            doisFatores: admin.doisFatores
        });
    }

    private limpar(): void {
        this.form.reset({
            nome: '', cpf: '', rg: '', nascimento: null, genero: '', email: '', telefone: '',
            cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '',
            nivel: '', cargo: '', unidade: '', admissao: null, senha: '', confirmacaoSenha: '',
            doisFatores: true
        });
    }
}