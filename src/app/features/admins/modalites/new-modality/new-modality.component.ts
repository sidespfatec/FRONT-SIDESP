import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ModalityDemoStore } from '../modality-demo.store';

@Component({
  selector: 'app-new-modality',
  imports: [
    FormsModule, BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
    CardModule, ButtonModule, InputTextModule, SelectModule
  ],
  templateUrl: './new-modality.component.html',
  styleUrl: './new-modality.component.scss'
})
export class NewModalityComponent {
  private readonly router = inject(Router);
  private readonly store = inject(ModalityDemoStore);

  name = '';
  icon = 'pi pi-circle-fill';
  minAge: number | null = null;
  maxAge: number | null = null;
  monthlyAbsenceLimit: number | null = null;
  hubId = '';
  errorMessage = '';

  readonly hubs = this.store.hubs;
  readonly icons = [
    { label: 'Padrão', value: 'pi pi-circle-fill' },
    { label: 'Estrela', value: 'pi pi-star' },
    { label: 'Coração', value: 'pi pi-heart' },
    { label: 'Raio', value: 'pi pi-bolt' },
    { label: 'Grupo', value: 'pi pi-users' }
  ];

  cancel(): void {
    this.router.navigate(['/manage-modalites']);
  }

  save(): void {
    this.errorMessage = '';
    if (this.minAge === null || this.maxAge === null || this.monthlyAbsenceLimit === null) {
      this.errorMessage = 'Informe as idades e o limite de faltas.';
      return;
    }
    try {
      this.store.create({
        name: this.name,
        minAge: this.minAge,
        maxAge: this.maxAge,
        monthlyAbsenceLimit: this.monthlyAbsenceLimit,
        hubId: this.hubId,
        icon: this.icon
      });
      this.router.navigate(['/manage-modalites']);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Não foi possível cadastrar.';
    }
  }
}
