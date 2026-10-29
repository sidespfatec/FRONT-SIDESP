import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { GuardianService } from '../../core/services/guardian.service';
import { AuthService } from '../../core/auth/auth.service';
import { Child } from '../../core/models/management.models';
import { todayIso, isMinor, validCpf } from '../../core/auth/validation';
import { apiError } from '../../core/services/api-error';
@Component({
  selector: 'app-dependent',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './dependent.component.html',
  styleUrls: ['../../component/integration-form.scss', './account.scss'],
})
export class DependentComponent {
  private service = inject(GuardianService);
  private auth = inject(AuthService);
  busy = signal(false);
  error = signal('');
  message = signal('');
  today = todayIso();
  addressFields = [
    { key: 'cep', label: 'CEP', max: 9 },
    { key: 'rua', label: 'Rua', max: 50 },
    { key: 'numero', label: 'Número', max: 8 },
    { key: 'complemento', label: 'Complemento', max: 100 },
    { key: 'bairro', label: 'Bairro', max: 40 },
    { key: 'cidade', label: 'Cidade', max: 30 },
    { key: 'uf', label: 'UF', max: 2 },
  ] as const;
  medicalFields = [
    { key: 'condicoes', label: 'Condições de saúde' },
    { key: 'alergias', label: 'Alergias' },
    { key: 'medicamentos', label: 'Medicamentos' },
    { key: 'restricoes', label: 'Restrições para atividades' },
  ] as const;
  model: Child = {
    dadosPessoais: { nome: '', cpf: '', dataNascimento: '', genero: '', telefone: '' },
    endereco: { cep: '', rua: '', numero: '', complemento: null, bairro: '', cidade: '', uf: '' },
    parentesco: '',
    fichaMedica: {
      condicoes: '',
      alergias: '',
      medicamentos: '',
      restricoes: '',
      contatoEmergencia: '',
      telefoneEmergencia: '',
    },
  };
  /** Vincula o menor à sessão atual; não solicita senha de outra conta nem escolhe outro responsável. */
  save(form: NgForm): void {
    if (this.busy()) return;
    this.error.set('');
    this.message.set('');
    const p = this.model.dadosPessoais;
    if (p.cpf && !validCpf(p.cpf)) {
      this.error.set('Informe um CPF válido ou deixe o campo vazio.');
      return;
    }
    if (form.invalid || p.dataNascimento > this.today || !isMinor(p.dataNascimento)) {
      form.control.markAllAsTouched();
      this.error.set(
        'Confira os campos. O dependente deve ter menos de 18 anos e nascimento válido.',
      );
      return;
    }
    this.busy.set(true);
    const body: Child = {
      ...this.model,
      dadosPessoais: { ...p, cpf: p.cpf || null },
      endereco: { ...this.model.endereco, uf: this.model.endereco.uf.toUpperCase() },
    };
    this.service
      .create(body)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.message.set('Dependente cadastrado e vinculado à sua conta.');
          this.auth.me().subscribe({ error: () => this.auth.clear() });
          form.resetForm();
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
}
