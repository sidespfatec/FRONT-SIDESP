import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { CardModule } from 'primeng/card';
import { Hub, ModalityInput } from '../../../../core/models/management.models';
import { HubService } from '../../../../core/services/hub.service';
import { ModalityService } from '../../../../core/services/modality.service';
import { apiError } from '../../../../core/services/api-error';
@Component({
  selector: 'app-new-modality',
  standalone: true,
  imports: [FormsModule, BannerComponent, FooterComponent, NavbarDesktopAdminComponent, CardModule],
  templateUrl: './new-modality.component.html',
  styleUrls: ['./new-modality.component.scss', '../../../../component/integration-form.scss'],
})
export class NewModalityComponent implements OnInit {
  private router = inject(Router);
  private hubService = inject(HubService);
  private service = inject(ModalityService);
  hubs = signal<Hub[]>([]);
  loading = signal(false);
  busy = signal(false);
  error = signal('');
  model: ModalityInput = {
    nome: '',
    idadeMinima: null as unknown as number,
    idadeMaxima: null as unknown as number,
    limiteFaltasMensais: null as unknown as number,
    poloId: null as unknown as number,
  };
  /** Oferece somente polos ativos vindos do banco. */
  ngOnInit(): void {
    this.loadHubs();
  }
  /** Permite tentar novamente quando a consulta de polos falha. */
  loadHubs(): void {
    this.loading.set(true);
    this.error.set('');
    this.hubService
      .list('', true)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({ next: (r) => this.hubs.set(r), error: (e) => this.error.set(apiError(e)) });
  }
  /** Volta sem salvar dados parciais. */
  cancel(): void {
    void this.router.navigate(['/manage-modalites']);
  }
  /** Valida a faixa etária e navega somente depois de receber a confirmação da API. */
  save(form: NgForm): void {
    if (this.busy()) return;
    this.error.set('');
    if (form.invalid || !this.model.poloId) {
      form.control.markAllAsTouched();
      this.error.set('Preencha todos os campos e escolha um polo ativo.');
      return;
    }
    if (this.model.idadeMinima > this.model.idadeMaxima) {
      this.error.set('A idade mínima não pode superar a máxima.');
      return;
    }
    this.busy.set(true);
    this.service
      .create(this.model)
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: () => void this.router.navigate(['/manage-modalites']),
        error: (e) => this.error.set(apiError(e)),
      });
  }
}
