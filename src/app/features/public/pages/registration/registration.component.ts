import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StepperModule } from 'primeng/stepper';
import { InputMaskModule } from 'primeng/inputmask';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PasswordModule } from 'primeng/password';
import { ValidatorFn } from '@angular/forms';
import { SimpleBannerComponent } from '../../../../component/simple-banner/simple-banner.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { Registration } from '../../../../core/auth/auth.models';
import {
  cpfValidator,
  passwordValidator,
  nonBlank,
  isMinor,
  todayIso,
} from '../../../../core/auth/validation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
function isoBirth(value: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  return match ? match[3] + '-' + match[2] + '-' + match[1] : value;
}
const maskedBirthValidator: ValidatorFn = (control) => {
  if (!control.value) return null;
  const iso = isoBirth(control.value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return { date: true };
  const date = new Date(iso + 'T12:00:00');
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(iso.slice(0, 4)) ||
    date.getMonth() + 1 !== Number(iso.slice(5, 7)) ||
    date.getDate() !== Number(iso.slice(8, 10))
  )
    return { date: true };
  return iso > todayIso() ? { future: true } : null;
};

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    StepperModule,
    InputMaskModule,
    SelectButtonModule,
    PasswordModule,
    SimpleBannerComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
  ];
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private text(max: number) {
    return this.fb.nonNullable.control('', [
      Validators.required,
      nonBlank,
      Validators.maxLength(max),
    ]);
  }
  form = this.fb.nonNullable.group({
    nome: this.text(150),
    cpf: ['', [cpfValidator]],
    dataNascimento: ['', [Validators.required, maskedBirthValidator]],
    genero: ['', [Validators.required]],
    telefone: this.text(20),
    guardianName: [''],
    guardianCpf: [''],
    guardianBirthdate: [''],
    guardianPhone: [''],
    kinship: [''],
    cep: this.text(9),
    rua: this.text(50),
    numero: this.text(8),
    complemento: ['', [Validators.maxLength(100)]],
    bairro: this.text(40),
    cidade: this.text(30),
    uf: this.text(2),
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    senha: ['', [passwordValidator]],
    confirmacaoSenha: ['', [Validators.required]],
  });
  activeStep = 1;
  busy = signal(false);
  error = signal('');
  fieldErrors = signal<Record<string, string>>({});
  today = todayIso();
  get minor() {
    return (
      !!this.form.controls.dataNascimento.value &&
      isMinor(isoBirth(this.form.controls.dataNascimento.value))
    );
  }
  constructor() {
    this.form.controls.dataNascimento.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.configureGuardian());
    this.configureGuardian();
  }
  private configureGuardian() {
    const required = this.minor;
    const c = this.form.controls;
    c.cpf.setValidators(required ? [cpfValidator] : [Validators.required, cpfValidator]);
    c.cpf.updateValueAndValidity({ emitEvent: false });
    for (const [control, validators] of [
      [c.guardianName, [Validators.required, nonBlank, Validators.maxLength(80)]],
      [c.guardianCpf, [Validators.required, cpfValidator]],
      [c.guardianBirthdate, [Validators.required, maskedBirthValidator]],
      [c.guardianPhone, [Validators.required, nonBlank, Validators.maxLength(20)]],
      [c.kinship, [Validators.required, nonBlank, Validators.maxLength(50)]],
    ] as [FormControl, any[]][]) {
      control.setValidators(required ? validators : []);
      control.updateValueAndValidity({ emitEvent: false });
    }
  }
  next(step: number, callback: (n: number) => void) {
    this.error.set('');
    const names =
      step === 2
        ? [
            'nome',
            'cpf',
            'dataNascimento',
            'genero',
            'telefone',
            ...(this.minor
              ? ['guardianName', 'guardianCpf', 'guardianBirthdate', 'guardianPhone', 'kinship']
              : []),
          ]
        : ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];
    let invalid = false;
    for (const key of names) {
      const c = this.form.get(key)!;
      c.markAsTouched();
      if (c.invalid) invalid = true;
    }
    if (
      this.minor &&
      this.form.controls.guardianBirthdate.value &&
      isMinor(isoBirth(this.form.controls.guardianBirthdate.value))
    ) {
      this.error.set('O responsável deve ter 18 anos completos.');
      return;
    }
    if (invalid) {
      this.error.set(
        'Confira os campos desta etapa. CPF deve ser válido e nascimento não pode estar no futuro.',
      );
      return;
    }
    this.activeStep = step;
    callback(step);
  }
  invalid(name: string) {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }
  submit() {
    if (this.busy()) return;
    this.error.set('');
    this.fieldErrors.set({});
    this.form.markAllAsTouched();
    const v = this.form.getRawValue();
    if (v.senha !== v.confirmacaoSenha) {
      this.error.set('As senhas não coincidem.');
      return;
    }
    if (this.form.invalid) {
      this.error.set('Confira todos os campos. A senha precisa ter de 8 a 128 caracteres.');
      return;
    }
    const payload: Registration = {
      dadosPessoais: {
        nome: v.nome,
        cpf: v.cpf || null,
        dataNascimento: isoBirth(v.dataNascimento),
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
        email: v.email,
        senha: v.senha,
        confirmacaoSenha: v.confirmacaoSenha,
        cpfLogin: this.minor ? v.guardianCpf : v.cpf,
      },
    };
    if (this.minor)
      payload.responsavel = {
        nome: v.guardianName,
        cpf: v.guardianCpf,
        dataNascimento: isoBirth(v.guardianBirthdate),
        telefone: v.guardianPhone,
        parentesco: v.kinship,
      };
    this.busy.set(true);
    this.auth
      .register(payload)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.form.controls.senha.reset();
          this.form.controls.confirmacaoSenha.reset();
          void this.router.navigate(['/login'], { queryParams: { cadastrado: '1' } });
        },
        error: (e) => {
          this.error.set(
            e.error?.mensagem || 'Não foi possível conectar. Confira se o backend está iniciado.',
          );
          this.fieldErrors.set(e.error?.errosCampos || {});
        },
      });
  }
  serverErrors() {
    return Object.values(this.fieldErrors());
  }
}
