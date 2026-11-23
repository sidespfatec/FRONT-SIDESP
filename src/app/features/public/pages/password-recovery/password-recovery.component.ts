import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { RecoveryService } from '../../../../core/auth/recovery.service';

//a senha tem de 8 a 128 caracteres (Rules.java do back)
const SENHA_MIN = 8;
const SENHA_MAX = 128;

@Component({
    selector: 'app-password-recovery',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule],
    templateUrl: './password-recovery.component.html',
    styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent {

    //a tela tem dois passos: pedir o código e depois usá-lo
    passo: 'PEDIR' | 'REDEFINIR' = 'PEDIR';

    identificador = '';
    codigo = '';
    novaSenha = '';
    confirmacao = '';

    aviso = '';
    erro = '';
    enviando = false;

    senhaMin = SENHA_MIN;

    constructor(
        private service: RecoveryService,
        private router: Router
    ) { }

    // ------------------------------------------------------------------
    // PASSO 1: pedir o código
    // ------------------------------------------------------------------

    pedirCodigo(): void {
        this.erro = '';

        if (!this.identificador.trim()) {
            this.erro = 'Informe seu CPF ou e-mail.';
            return;
        }

        this.enviando = true;

        this.service.solicitarCodigo(this.identificador.trim()).subscribe({
            next: (resposta) => {
                this.enviando = false;
                //o back responde igual exista ou não a conta, de propósito:
                //assim ninguém descobre quais CPFs estão cadastrados
                this.aviso = resposta.mensagem;
                this.passo = 'REDEFINIR';
            },
            error: (falha: HttpErrorResponse) => {
                this.enviando = false;
                this.erro = this.explicarErro(falha);
            }
        });
    }

    // ------------------------------------------------------------------
    // PASSO 2: usar o código
    // ------------------------------------------------------------------

    get senhasConferem(): boolean {
        return this.novaSenha === this.confirmacao;
    }

    get senhaTemTamanho(): boolean {
        return this.novaSenha.length >= SENHA_MIN && this.novaSenha.length <= SENHA_MAX;
    }

    get podeRedefinir(): boolean {
        return !!this.codigo.trim() && this.senhaTemTamanho && this.senhasConferem;
    }

    redefinir(): void {
        this.erro = '';

        if (!this.podeRedefinir) {
            return;
        }

        this.enviando = true;

        this.service.redefinirSenha(this.codigo.trim(), this.novaSenha, this.confirmacao).subscribe({
            next: () => {
                this.enviando = false;
                //redefinir derruba as sessões antigas, então a pessoa entra de novo
                this.router.navigateByUrl('/login');
            },
            error: (falha: HttpErrorResponse) => {
                this.enviando = false;
                this.erro = this.explicarErro(falha);
            }
        });
    }

    /** Volta ao passo 1 quando a pessoa não recebeu o e-mail. */
    pedirDeNovo(): void {
        this.passo = 'PEDIR';
        this.codigo = '';
        this.erro = '';
        this.aviso = '';
    }

    private explicarErro(falha: HttpErrorResponse): string {
        if (falha.status === 0) {
            return 'Sem conexão com o servidor.';
        }
        if (falha.status === 429) {
            return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
        }
        //o back devolve { campo, mensagem } nos erros de validação
        return falha.error?.mensagem ?? 'Não foi possível concluir. Tente de novo.';
    }
}
