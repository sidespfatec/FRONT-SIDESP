import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { CardModule } from 'primeng/card';
import { Modality } from '../../../core/models/management.models';
import { ModalityService } from '../../../core/services/modality.service';
import { HubService } from '../../../core/services/hub.service';
import { apiError } from '../../../core/services/api-error';
@Component({
  selector: 'app-manage-modalites',
  standalone: true,
  imports: [
    SelectButtonModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    FormsModule,
    BannerComponent,
    FooterComponent,
    NavbarDesktopAdminComponent,
    CardModule,
  ],
  templateUrl: './manage-modalites.component.html',
  styleUrls: ['./manage-modalites.component.scss', '../../../component/integration-form.scss'],
})
export class ManageModalitesComponent implements OnInit {
  private router = inject(Router);
  private service = inject(ModalityService);
  private hubService = inject(HubService);
  modalities = signal<Modality[]>([]);
  hubs = signal(new Map<number, string>());
  busy = signal(false);
  error = signal('');
  message = signal('');
  search = '';
  readonly filterOptions = [
    { label: 'Ativas', value: 'active' },
    { label: 'Inativas', value: 'inactive' },
    { label: 'Todas', value: 'all' },
  ];
  status = 'active';
  /** Carrega modalidades e nomes de polos reais sem inventar contagens de turmas ou alunos. */
  ngOnInit(): void {
    this.load();
    this.hubService.list().subscribe({
      next: (r) => this.hubs.set(new Map(r.map((h) => [h.id, h.nome]))),
      error: (e) => this.error.set(apiError(e)),
    });
  }
  /** Aplica filtros na listagem recebida. */
  get filteredModalities(): Modality[] {
    return this.modalities().filter(
      (m) =>
        m.nome.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) &&
        (this.status === 'all' || Boolean(m.ativo) === (this.status === 'active')),
    );
  }
  /** Reconsulta o banco depois de cadastrar ou alterar uma situação. */
  load(): void {
    this.busy.set(true);
    this.error.set('');
    this.service
      .list()
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (r) => this.modalities.set(r),
        error: (e) => this.error.set(apiError(e)),
      });
  }
  /** Abre o formulário de cadastro integrado. */
  openNew(): void {
    void this.router.navigate(['/manage-modalites/new-modality']);
  }
  /** Altera a situação sem remover modalidades ou seus vínculos. */
  toggle(m: Modality): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.service
      .status(m.id, !m.ativo)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => {
          this.message.set('Situação atualizada.');
          this.load();
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
}
