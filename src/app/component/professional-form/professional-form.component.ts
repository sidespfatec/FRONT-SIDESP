import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/management.models';
import { cpfValidator, passwordValidator, todayIso } from '../../core/auth/validation';
import { apiError } from '../../core/services/api-error';
@Component({
  selector: 'app-professional-form',
  standalone: true,
  imports: [ButtonModule, InputTextModule, TagModule, ReactiveFormsModule],
  templateUrl: './professional-form.component.html',
  styleUrl: './professional-form.component.scss',
})
export class ProfessionalFormComponent {
  @Input() administrator = false;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  private fb = inject(FormBuilder);
  private service = inject(ProfessionalService);
  busy = signal(false);
  error = signal('');
  today = todayIso();
  fields = [
    { key: 'nome', label: 'Nome completo', type: 'text', max: 150 },
    { key: 'cpf', label: 'CPF', type: 'text', max: 14 },
    { key: 'nascimento', label: 'Data de nascimento', type: 'date', max: 10 },
    { key: 'email', label: 'E-mail', type: 'email', max: 254 },
    { key: 'telefone', label: 'Telefone', type: 'tel', max: 20 },
    { key: 'cep', label: 'CEP', type: 'text', max: 9 },
    { key: 'rua', label: 'Rua', type: 'text', max: 50 },
    { key: 'numero', label: 'Número', type: 'text', max: 8 },
    { key: 'bairro', label: 'Bairro', type: 'text', max: 40 },
    { key: 'cidade', label: 'Cidade', type: 'text', max: 30 },
    { key: 'uf', label: 'UF', type: 'text', max: 2 },
  ];
  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    cpf: ['', [Validators.required, cpfValidator]],
    nascimento: ['', Validators.required],
    genero: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    telefone: ['', Validators.required],
    cep: ['', Validators.required],
    rua: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: [''],
    bairro: ['', Validators.required],
    cidade: ['', Validators.required],
    uf: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]{2}$/)]],
    senha: ['', [Validators.required, passwordValidator]],
    confirmacao: ['', Validators.required],
    nivel: ['ADMINISTRADOR_PARCIAL'],
    rg: [''],
    registro: [''],
    especialidade: [''],
    cargo: [''],
    unidade: [''],
    admissao: [''],
  });
  /** Valida o cadastro e só avisa a listagem depois da gravação confirmada pelo servidor. */
  submit(): void {
    if (this.busy()) return;
    this.form.markAllAsTouched();
    this.error.set('');
    const v = this.form.getRawValue();
    if (this.form.invalid) {
      this.error.set('Confira os campos obrigatórios, CPF, e-mail e senha de 8 a 128 caracteres.');
      return;
    }
    if (v.senha !== v.confirmacao) {
      this.error.set('As senhas não coincidem.');
      return;
    }
    if (v.nascimento > this.today || (v.admissao && v.admissao > this.today)) {
      this.error.set('Nascimento e admissão não podem estar no futuro.');
      return;
    }
    const body: Professional = {
      cadastro: {
        dadosPessoais: {
          nome: v.nome.trim(),
          cpf: v.cpf.replace(/\D/g, ''),
          dataNascimento: v.nascimento,
          genero: v.genero,
          telefone: v.telefone,
        },
        endereco: {
          cep: v.cep,
          rua: v.rua,
          numero: v.numero,
          complemento: v.complemento || null,
          bairro: v.bairro,
          cidade: v.cidade,
          uf: v.uf.toUpperCase(),
        },
        credenciais: {
          email: v.email.trim(),
          senha: v.senha,
          confirmacaoSenha: v.confirmacao,
          cpfLogin: v.cpf.replace(/\D/g, ''),
        },
      },
      ...(this.administrator
        ? {
            nivel: v.nivel as Professional['nivel'],
            rg: v.rg,
            cargo: v.cargo,
            unidade: v.unidade,
            ...(v.admissao ? { admissao: v.admissao } : {}),
          }
        : { registro: v.registro, especialidade: v.especialidade }),
    };
    this.busy.set(true);
    const request = this.administrator
      ? this.service.createAdministrator(body)
      : this.service.createTeacher(body);
    request.pipe(finalize(() => this.busy.set(false))).subscribe({
      next: () => {
        this.form.reset();
        this.saved.emit();
      },
      error: (e) => this.error.set(apiError(e)),
    });
  }
}
