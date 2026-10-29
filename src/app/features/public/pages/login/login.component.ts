
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BannerComponent,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form = this.fb.nonNullable.group({
    identificador: ['', Validators.required],
    senha: ['', Validators.required]
  });

  busy = signal(false);
  error = signal('');
  registered = this.route.snapshot.queryParamMap.get('cadastrado') === '1';

  submit() {
    if (this.busy()) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set('');

    const v = this.form.getRawValue();

    this.auth.login(v.identificador.trim(), v.senha)
      .pipe(
        switchMap(() => this.auth.me()),
        finalize(() => this.busy.set(false))
      )
      .subscribe({
        next: u => {
          void this.router.navigate([this.auth.destination(u.perfil)]);
        },
        error: e => {
          this.auth.clear();
          this.error.set(
            e.error?.mensagem ||
            'Não foi possível conectar. Confira se o backend está iniciado.'
          );
        }
      });
  }

  recovery() {
    this.error.set(
      'A recuperação de senha ainda não está disponível nesta versão. Procure a equipe da Secretaria.'
    );
  }
}
