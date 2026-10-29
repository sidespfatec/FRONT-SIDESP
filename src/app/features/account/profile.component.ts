import { BannerComponent } from '../../component/banner/banner.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AccountService } from '../../core/services/account.service';
import { AuthService } from '../../core/auth/auth.service';
import { Profile, ProfileInput } from '../../core/models/management.models';
import { apiError } from '../../core/services/api-error';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    BannerComponent,
    FooterComponent,
    CardModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['../../component/integration-form.scss', './account.scss'],
})
export class ProfileComponent implements OnInit {
  private service = inject(AccountService);
  private router = inject(Router);
  auth = inject(AuthService);
  profile = signal<Profile | null>(null);
  busy = signal(false);
  error = signal('');
  message = signal('');
  model: ProfileInput = {
    nome: '',
    nomeSocial: '',
    email: '',
    telefone: '',
    endereco: { cep: '', rua: '', numero: '', complemento: null, bairro: '', cidade: '', uf: '' },
  };
  password = { senhaAtual: '', novaSenha: '', confirmacao: '' };
  addressFields = [
    { key: 'cep', label: 'CEP', max: 9 },
    { key: 'rua', label: 'Rua', max: 50 },
    { key: 'numero', label: 'Número', max: 8 },
    { key: 'complemento', label: 'Complemento', max: 100 },
    { key: 'bairro', label: 'Bairro', max: 40 },
    { key: 'cidade', label: 'Cidade', max: 30 },
    { key: 'uf', label: 'UF', max: 2 },
  ] as const;
  /** Consulta somente o perfil do titular autenticado. */
  ngOnInit(): void {
    this.load();
  }
  /** Preenche o formulário com os dados reais; campos desconhecidos permanecem vazios. */
  load(): void {
    this.busy.set(true);
    this.error.set('');
    this.service
      .profile()
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (p) => {
          this.profile.set(p);
          this.model = {
            nome: p.nome,
            nomeSocial: p.nomeSocial || '',
            email: p.email,
            telefone: p.telefones[0] || '',
            endereco: p.enderecos[0]
              ? { ...p.enderecos[0] }
              : { cep: '', rua: '', numero: '', complemento: null, bairro: '', cidade: '', uf: '' },
          };
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
  /** Atualiza o perfil e a saudação depois que o servidor confirma a gravação. */
  save(form: NgForm): void {
    if (this.busy()) return;
    this.error.set('');
    this.message.set('');
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.error.set('Confira os campos obrigatórios.');
      return;
    }
    this.busy.set(true);
    this.service
      .update({
        ...this.model,
        endereco: { ...this.model.endereco, uf: this.model.endereco.uf.toUpperCase() },
      })
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.message.set('Perfil atualizado.');
          this.auth.me().subscribe({ error: () => this.auth.clear() });
          this.load();
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
  /** Exige a senha atual e encerra a sessão quando a senha nova é aceita. */
  changePassword(form: NgForm): void {
    if (this.busy()) return;
    this.error.set('');
    this.message.set('');
    if (form.invalid || this.password.novaSenha !== this.password.confirmacao) {
      this.error.set(
        'Confira as senhas. A nova senha precisa ter de 8 a 128 caracteres e coincidir com a confirmação.',
      );
      return;
    }
    this.busy.set(true);
    this.service
      .password(this.password.senhaAtual, this.password.novaSenha, this.password.confirmacao)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.password = { senhaAtual: '', novaSenha: '', confirmacao: '' };
          void this.router.navigate(['/login']);
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
}
