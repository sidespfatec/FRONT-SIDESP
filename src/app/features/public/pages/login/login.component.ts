import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';

import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, RouterLink, InputMaskModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  // O que está digitado. Propriedade comum: muda dentro de evento de tecla,
  // e todo evento faz o Angular repintar.
  cpf = '';
  senha = '';

  /** Mensagem de erro para mostrar na tela. '' = sem erro. */
  erro = '';

  /** Trava o botão enquanto a resposta não chega, para não mandar duas vezes. */
  entrando = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Chegar na tela de login encerra a sessão anterior.
    // Isso evita o caso chato: entrar como professor, voltar no /login,
    // e o app continuar achando que você é o professor de antes.
    this.auth.sair();
  }

  entrar(): void {
    this.erro = '';

    if (!this.cpf || !this.senha) {
      this.erro = 'Preencha o CPF e a senha.';
      return;
    }

    this.entrando = true;

    // O back chama de 'identificador' porque aceita CPF ou e-mail.
    this.auth.login({ identificador: this.cpf, senha: this.senha }).subscribe({

      next: () => {
        this.entrando = false;
        // rotaInicial decide pelo perfil: professor vai para /professor,
        // administrador para o painel dele.
        this.router.navigateByUrl(this.auth.rotaInicial());
      },

      error: (falha: HttpErrorResponse) => {
        this.entrando = false;
        this.erro = this.explicarErro(falha);
      }
    });
  }

  private explicarErro(falha: HttpErrorResponse): string {
    if (falha.status === 0) {
      return 'Servidor fora do ar. O back-end está rodando?';
    }
    if (falha.status === 401 || falha.status === 400) {
      // Nunca dizer QUAL dos dois está errado: isso contaria a um invasor
      // que aquele CPF existe no sistema.
      return 'CPF ou senha incorretos.';
    }
    if (falha.status === 429) {
      return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    }
    return falha.error?.mensagem ?? 'Não foi possível entrar. Tente de novo.';
  }
}
