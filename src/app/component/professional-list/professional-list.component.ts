import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { finalize } from 'rxjs';
import { ProfessionalSummary } from '../../core/models/management.models';
import { ProfessionalService } from '../../core/services/professional.service';
import { apiError } from '../../core/services/api-error';
import { ProfessionalFormComponent } from '../professional-form/professional-form.component';
@Component({
  selector: 'app-professional-list',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    TagModule,
    FormsModule,
    DialogModule,
    CardModule,
    ProfessionalFormComponent,
  ],
  templateUrl: './professional-list.component.html',
  styleUrl: './professional-list.component.scss',
})
export class ProfessionalListComponent implements OnInit {
  @Input() administrator = false;
  private service = inject(ProfessionalService);
  rows = signal<ProfessionalSummary[]>([]);
  busy = signal(false);
  error = signal('');
  message = signal('');
  search = '';
  status = 'all';
  visible = false;
  selected: ProfessionalSummary | null = null;
  /** Busca registros reais ao entrar na tela. */
  ngOnInit(): void {
    this.load();
  }
  /** Filtra a lista recebida sem fabricar dados ausentes da API. */
  get filtered(): ProfessionalSummary[] {
    return this.rows().filter(
      (r) =>
        r.nome.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) &&
        (this.status === 'all' || Boolean(r.ativo) === (this.status === 'active')),
    );
  }
  /** Reconsulta o servidor depois de cada gravação. */
  load(): void {
    this.busy.set(true);
    this.error.set('');
    const req = this.administrator ? this.service.administrators() : this.service.teachers();
    req
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({ next: (r) => this.rows.set(r), error: (e) => this.error.set(apiError(e)) });
  }
  /** Exibe confirmação somente após a API gravar o cadastro. */
  saved(): void {
    this.visible = false;
    this.message.set('Cadastro realizado.');
    this.load();
  }
  /** Inativa ou reativa preservando o histórico; a API confere permissões e a própria conta. */
  toggle(row: ProfessionalSummary): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    this.service
      .status(this.administrator ? 'administradores' : 'professores', row.id, !row.ativo)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.message.set('Situação atualizada.');
          this.selected = null;
          this.load();
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
}
