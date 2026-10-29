import { BannerComponent } from '../../component/banner/banner.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { GuardianService } from '../../core/services/guardian.service';
import { Medical } from '../../core/models/management.models';
import { apiError } from '../../core/services/api-error';
@Component({
  selector: 'app-medical',
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
  templateUrl: './medical.component.html',
  styleUrls: ['../../component/integration-form.scss', './account.scss'],
})
export class MedicalComponent {
  private service = inject(GuardianService);
  id: number | null = null;
  busy = signal(false);
  error = signal('');
  medical = signal<Medical | null>(null);
  fields = [
    { key: 'condicoes', label: 'Condições de saúde' },
    { key: 'alergias', label: 'Alergias' },
    { key: 'medicamentos', label: 'Medicamentos' },
    { key: 'restricoes', label: 'Restrições' },
    { key: 'contatoEmergencia', label: 'Contato de emergência' },
    { key: 'telefoneEmergencia', label: 'Telefone de emergência' },
  ] as const;
  /** Consulta apenas um ID informado, com autorização de perfil e vínculo conferida no backend. */
  load(form: NgForm): void {
    if (this.busy()) return;
    this.medical.set(null);
    this.error.set('');
    if (form.invalid || !this.id || !Number.isInteger(this.id)) {
      this.error.set('Informe um identificador válido.');
      return;
    }
    this.busy.set(true);
    this.service
      .medical(this.id)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({ next: (m) => this.medical.set(m), error: (e) => this.error.set(apiError(e)) });
  }
}
