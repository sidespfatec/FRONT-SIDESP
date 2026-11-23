import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

//a senha tem de 8 a 128 caracteres
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

    constructor(private router: Router) { }

    // ------------------------------------------------------------------
    // PASSO 1: pedir o código
    // ------------------------------------------------------------------

    pedirCodigo(): void {
        this.erro = '';

        if (!this.identificador.trim()) {
            this.erro = 'Informe seu CPF ou e-mail.';
            return;
        }

        //a mensagem é a mesma exista ou não a conta, de propósito:
        //assim ninguém descobre quais CPFs estão cadastrados
        this.aviso = 'Se houver uma conta cadastrada, enviaremos as instruções para o e-mail informado no cadastro.';
        this.passo = 'REDEFINIR';
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

        //redefinir derruba as sessões antigas, então a pessoa entra de novo
        this.router.navigateByUrl('/login');
    }

    /** Volta ao passo 1 quando a pessoa não recebeu o e-mail. */
    pedirDeNovo(): void {
        this.passo = 'PEDIR';
        this.codigo = '';
        this.erro = '';
        this.aviso = '';
    }
}
