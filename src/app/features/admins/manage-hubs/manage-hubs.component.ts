import { AfterViewInit, Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { finalize } from 'rxjs';
import * as L from 'leaflet';
import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Hub, HubInput } from '../../../core/models/management.models';
import { HubService } from '../../../core/services/hub.service';
import { apiError } from '../../../core/services/api-error';
@Component({
  selector: 'app-manage-hubs',
  standalone: true,
  imports: [
    FormsModule,
    BannerComponent,
    FooterComponent,
    NavbarDesktopAdminComponent,
    CardModule,
    DialogModule,
  ],
  templateUrl: './manage-hubs.component.html',
  styleUrls: ['./manage-hubs.component.scss', '../../../component/integration-form.scss'],
})
export class ManageHubsComponent implements AfterViewInit, OnDestroy {
  private service = inject(HubService);
  private map?: L.Map;
  private markers?: L.LayerGroup;
  hubs = signal<Hub[]>([]);
  busy = signal(false);
  saving = signal(false);
  error = signal('');
  formError = signal('');
  message = signal('');
  search = '';
  status = 'all';
  visible = false;
  selected: Hub | null = null;
  model = this.blank();
  addressFields = [
    { key: 'cep', label: 'CEP', max: 9 },
    { key: 'rua', label: 'Rua', max: 50 },
    { key: 'numero', label: 'Número', max: 8 },
    { key: 'bairro', label: 'Bairro', max: 40 },
    { key: 'cidade', label: 'Cidade', max: 30 },
    { key: 'uf', label: 'UF', max: 2 },
  ] as const;
  /** Inicia o mapa e carrega apenas polos retornados pelo banco. */
  ngAfterViewInit(): void {
    this.map = L.map('hub-map').setView([-22.816, -45.193], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
    this.markers = L.layerGroup().addTo(this.map);
    this.load();
  }
  /** Libera o mapa quando a pessoa sai da página. */
  ngOnDestroy(): void {
    this.map?.remove();
  }
  /** Prepara um formulário vazio; coordenadas nunca recebem valores fictícios. */
  blank(): HubInput {
    return {
      nome: '',
      endereco: { cep: '', rua: '', numero: '', complemento: null, bairro: '', cidade: '', uf: '' },
      latitude: null as unknown as number,
      longitude: null as unknown as number,
    };
  }
  /** Busca no servidor aplicando texto e situação selecionados. */
  load(): void {
    this.busy.set(true);
    this.error.set('');
    this.service
      .list(this.search, this.status === 'all' ? undefined : this.status === 'active')
      .pipe(finalize(() => this.busy.set(false)))
      .subscribe({
        next: (r) => {
          this.hubs.set(r);
          this.draw();
        },
        error: (e) => this.error.set(apiError(e)),
      });
  }
  /** Mostra os polos com coordenadas válidas, usando texto seguro no marcador. */
  draw(): void {
    this.markers?.clearLayers();
    const points: L.LatLngExpression[] = [];
    for (const hub of this.hubs()) {
      if (hub.latitude == null || hub.longitude == null) continue;
      const point: L.LatLngExpression = [Number(hub.latitude), Number(hub.longitude)];
      points.push(point);
      const label = document.createElement('span');
      label.textContent = hub.nome;
      L.circleMarker(point, { radius: 8, color: hub.ativo ? '#0D1282' : '#71717A' })
        .bindTooltip(label)
        .addTo(this.markers!);
    }
    if (points.length)
      this.map?.fitBounds(L.latLngBounds(points), { padding: [25, 25], maxZoom: 14 });
  }
  /** Abre cadastro sem reutilizar dados de outro polo. */
  open(): void {
    this.model = this.blank();
    this.formError.set('');
    this.visible = true;
  }
  /** Grava nome, endereço e coordenadas na mesma requisição. */
  save(form: NgForm): void {
    if (this.saving()) return;
    this.formError.set('');
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.formError.set('Confira os campos obrigatórios e as coordenadas.');
      return;
    }
    this.saving.set(true);
    this.service
      .create({
        ...this.model,
        endereco: { ...this.model.endereco, uf: this.model.endereco.uf.toUpperCase() },
      })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.visible = false;
          this.message.set('Polo cadastrado.');
          this.load();
        },
        error: (e) => this.formError.set(apiError(e)),
      });
  }
  /** Preserva o polo e altera somente sua situação após confirmação da API. */
  toggle(hub: Hub): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    this.service
      .status(hub.id, !hub.ativo)
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
