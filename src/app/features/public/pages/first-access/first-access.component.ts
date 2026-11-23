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
    selector: 'app-first-access',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, ButtonModule, InputTextModule],
    templateUrl: './first-access.component.html',
    styleUrl: './first-access.component.scss'
})
export class FirstAccessComponent {

    codigo = '';
    novaSenha = '';
    confirmacao = '';

    erro = '';
    enviando = false;

    senhaMin = SENHA_MIN;

    constructor(
        private service: RecoveryService,
        private router: Router
    ) { }

    get senhasConferem(): boolean {
        return this.novaSenha === this.confirmacao;
    }

    get senhaTemTamanho(): boolean {
        return this.novaSenha.length >= SENHA_MIN && this.novaSenha.length <= SENHA_MAX;
    }

    get podeAtivar(): boolean {
        return !!this.codigo.trim() && this.senhaTemTamanho && this.senhasConferem;
    }

    ativar(): void {
        this.erro = '';

        if (!this.podeAtivar) {
            return;
        }

        this.enviando = true;

        this.service.primeiroAcesso(this.codigo.trim(), this.novaSenha, this.confirmacao).subscribe({
            next: () => {
                this.enviando = false;
                //a conta sai de inativa só agora; a pessoa entra com a senha que acabou de criar
                this.router.navigateByUrl('/login');
            },
            error: (falha: HttpErrorResponse) => {
                this.enviando = false;
                this.erro = this.explicarErro(falha);
            }
        });
    }

    private explicarErro(falha: HttpErrorResponse): string {
        if (falha.status === 0) {
            return 'Sem conexão com o servidor.';
        }
        if (falha.status === 429) {
            return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
        }
        return falha.error?.mensagem ?? 'Não foi possível concluir. Tente de novo.';
    }
}
