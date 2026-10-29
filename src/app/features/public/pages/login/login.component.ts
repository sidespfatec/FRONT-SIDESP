import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BannerComponent,
    ButtonModule,
    InputTextModule,
    RouterLink,
    InputMaskModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private account = inject(AccountService);
  private router = inject(Router);
  identificador = '';
  senha = '';
  busy = signal(false);
  message = signal('');

  /** Envia as credenciais e consulta o perfil confirmado pelo servidor. */
  submit(): void {
    if (this.busy() || !this.identificador || !this.senha) return;
    this.busy.set(true);
    this.message.set('');
    this.auth
      .login(this.identificador.trim(), this.senha)
      .pipe(
        switchMap(() => this.auth.me()),
        finalize(() => this.busy.set(false)),
      )
      .subscribe({
        next: (user) => {
          this.senha = '';
          void this.router.navigate([this.auth.destination(user.perfil)]);
        },
        error: (error) => {
          this.auth.clear();
          this.message.set(error.error?.mensagem || 'Não foi possível conectar ao servidor.');
        },
      });
  }

  /** Solicita o código para o CPF já preenchido, sem informar se a conta existe. */
  recover(): void {
    if (this.busy()) return;
    if (!this.identificador) {
      this.message.set('Preencha o CPF para solicitar a recuperação.');
      return;
    }
    this.busy.set(true);
    this.account
      .recover(this.identificador)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (result) => this.message.set(result.mensagem),
        error: (error) =>
          this.message.set(error.error?.mensagem || 'Não foi possível solicitar a recuperação.'),
      });
  }
}
