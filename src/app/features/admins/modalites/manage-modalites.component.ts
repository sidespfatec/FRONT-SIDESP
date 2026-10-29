import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Modality, ModalityDemoStore } from './modality-demo.store';

@Component({
  selector: 'app-manage-modalites',
  imports: [
    BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
    CardModule, ButtonModule, InputTextModule, FormsModule, SelectButtonModule
  ],
  templateUrl: './manage-modalites.component.html',
  styleUrl: './manage-modalites.component.scss'
})
export class ManageModalitesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly store = inject(ModalityDemoStore);

  filter: 'active' | 'inactive' = 'active';
  search = '';
  errorMessage = '';
  modalities: Modality[] = [];

  readonly filterOptions = [
    { label: 'Ativas', value: 'active' },
    { label: 'Inativas', value: 'inactive' }
  ];

  ngOnInit(): void {
    this.modalities = this.store.list();
  }

  get filteredModalities(): Modality[] {
    const query = this.search.trim().toLocaleLowerCase('pt-BR');
    return this.modalities.filter(item =>
      item.active === (this.filter === 'active') &&
      (!query || item.name.toLocaleLowerCase('pt-BR').includes(query))
    );
  }

  openModality(modality: Modality): void {
    if (modality.classesCount > 0) {
      this.router.navigate(['/manage-modalites', modality.id, 'classes']);
    }
  }

  openNew(): void {
    this.router.navigate(['/manage-modalites/new-modality']);
  }

  toggleStatus(modality: Modality): void {
    this.errorMessage = '';
    try {
      this.store.setActive(modality.id, !modality.active);
      this.modalities = this.store.list();
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Falha ao mudar o status.';
    }
  }
}
