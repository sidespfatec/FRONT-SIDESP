import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputMaskModule } from 'primeng/inputmask';
import { MaskCaretDirective } from '../../../../directives/mask-caret.directive';

import { GENEROS, maiorDeIdade, NovoProfessor, ProfessorCriado, SENHA_MIN, UFS } from '../teacher.model';
import { TeacherAdminService } from '../teacher.service';

@Component({
    selector: 'app-new-teacher-modal',
    imports: [DialogModule, InputTextModule, InputMaskModule, SelectModule, FileUploadModule, ButtonModule, FormsModule, MaskCaretDirective, MultiSelectModule, SelectButtonModule],
    templateUrl: './new-teacher-modal.component.html',
    styleUrl: './new-teacher-modal.component.scss'
})

export class NewTeacherModalComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() salvo = new EventEmitter<ProfessorCriado>();

    private readonly service = inject(TeacherAdminService);

    //a resposta chega fora de um evento: precisa ser signal para a tela repintar
    readonly salvando = signal(false);
    readonly erro = signal<string | null>(null);

    nome = '';
    cpf = '';
    nascimento = '';
    genero = '';
    email = '';
    telefone = '';

    cep = '';
    rua = '';
    numero = '';
    complemento = '';
    bairro = '';
    cidade = '';
    uf = '';

    senha = '';
    confirmacaoSenha = '';

    cref = '';
    selectedModalities: string[] = [];
    shirtSize: string | null = null;
    classGroup: string | null = null;
    contractType: 'contratado' | 'concursado' = 'contratado';

    readonly generos = GENEROS;
    readonly ufs = UFS;
    readonly senhaMin = SENHA_MIN;

    shirtSizes = [
        { label: 'PP', value: 'PP' },
        { label: 'P', value: 'P' },
        { label: 'M', value: 'M' },
        { label: 'G', value: 'G' },
        { label: 'GG', value: 'GG' },
        { label: 'XG', value: 'XG' }
    ];

    contractTypes = [
        { label: 'Contratado', value: 'contratado' },
        { label: 'Concursado', value: 'concursado' }
    ];

    modalities = [
        { label: 'Educação física', value: 'educacao-fisica' },
        { label: 'Natação', value: 'natacao' },
        { label: 'Vôlei', value: 'volei' },
        { label: 'Futebol', value: 'futebol' }
    ];

    classGroups = [
        { label: 'Turma A - Manhã', value: 'turma-a' },
        { label: 'Turma B - Tarde', value: 'turma-b' },
        { label: 'Turma C - Noite', value: 'turma-c' }
    ];

    get maiorDeIdade(): boolean {
        return maiorDeIdade(this.nascimento);
    }

    get senhaTemTamanho(): boolean {
        return this.senha.length >= SENHA_MIN;
    }

    get senhasConferem(): boolean {
        return this.senha === this.confirmacaoSenha;
    }

    get podeSalvar(): boolean {
        return !!this.nome.trim()
            && !!this.cpf.trim()
            && this.maiorDeIdade
            && !!this.genero
            && !!this.email.trim()
            && !!this.telefone.trim()
            && !!this.cep.trim()
            && !!this.rua.trim()
            && !!this.numero.trim()
            && !!this.bairro.trim()
            && !!this.cidade.trim()
            && !!this.uf
            && !!this.cref.trim()
            && this.selectedModalities.length > 0
            && this.senhaTemTamanho
            && this.senhasConferem
            && !this.salvando();
    }

    onSave(): void {
        if (!this.podeSalvar) { return; }

        this.salvando.set(true);
        this.erro.set(null);

        this.service.cadastrarProfessor(this.montarCorpo()).subscribe({
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

    onCancel(): void {
        this.erro.set(null);
        this.fechar();
    }

    /** Monta o corpo no formato aninhado que o POST espera. */
    private montarCorpo(): NovoProfessor {
        const cpf = this.cpf.trim();

        return {
            cadastro: {
                dadosPessoais: {
                    nome: this.nome.trim(),
                    cpf: cpf,
                    dataNascimento: this.nascimento,
                    genero: this.genero as 'M' | 'F',
                    telefone: this.telefone.trim()
                },
                endereco: {
                    cep: this.cep.trim(),
                    rua: this.rua.trim(),
                    numero: this.numero.trim(),
                    complemento: this.complemento.trim(),
                    bairro: this.bairro.trim(),
                    cidade: this.cidade.trim(),
                    uf: this.uf
                },
                credenciais: {
                    email: this.email.trim(),
                    senha: this.senha,
                    confirmacaoSenha: this.confirmacaoSenha,
                    cpfLogin: cpf
                }
            },
            registro: this.cref.trim(),
            especialidade: this.nomesDasModalidades()
        };
    }

    /** O campo da API é um texto só, então as modalidades vão separadas por vírgula. */
    private nomesDasModalidades(): string {
        return this.modalities
            .filter(m => this.selectedModalities.includes(m.value))
            .map(m => m.label)
            .join(', ');
    }

    private limpar(): void {
        this.nome = '';
        this.cpf = '';
        this.nascimento = '';
        this.genero = '';
        this.email = '';
        this.telefone = '';
        this.cep = '';
        this.rua = '';
        this.numero = '';
        this.complemento = '';
        this.bairro = '';
        this.cidade = '';
        this.uf = '';
        this.senha = '';
        this.confirmacaoSenha = '';
        this.cref = '';
        this.selectedModalities = [];
        this.shirtSize = null;
        this.classGroup = null;
        this.contractType = 'contratado';
    }

    private fechar(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }
}
