import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Modality, ModalityDemoStore } from './modality-demo.store';

@Component({
    selector: 'app-manage-modalites',
    imports: [
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        CardModule, ButtonModule, DialogModule, InputTextModule, FormsModule, SelectButtonModule
    ],
    templateUrl: './manage-modalites.component.html',
    styleUrl: './manage-modalites.component.scss'
})
export class ManageModalitesComponent implements OnInit {
    private router = inject(Router);
    private store = inject(ModalityDemoStore);

    filter: 'active' | 'inactive' = 'active';
    search = '';
    errorMessage = '';
    modalities: Modality[] = [];

    selected: Modality | null = null;
    detailsVisible = false;
    confirmingDelete = false;

    filterOptions = [
        { label: 'Ativas', value: 'active' },
        { label: 'Inativas', value: 'inactive' }
    ];

    ngOnInit() {
        this.modalities = this.store.list();
    }

    get filteredModalities(): Modality[] {
        const query = this.search.trim().toLocaleLowerCase('pt-BR');
        return this.modalities.filter(m =>
            m.active === (this.filter === 'active') &&
            (!query || m.name.toLocaleLowerCase('pt-BR').includes(query))
        );
    }

    openDetails(modality: Modality) {
        this.errorMessage = '';
        this.confirmingDelete = false;
        this.selected = modality;
        this.detailsVisible = true;
    }

    closeDetails() {
        this.detailsVisible = false;
        this.confirmingDelete = false;
    }

    viewClasses() {
        if (this.selected && this.selected.classesCount > 0) {
            this.router.navigate(['/manage-modalites', this.selected.id, 'classes']);
        }
    }

    deleteSelected() {
        if (!this.selected) return;
        try {
            this.store.remove(this.selected.id);
            this.modalities = this.store.list();
            this.closeDetails();
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Falha ao excluir.';
            this.confirmingDelete = false;
        }
    }

    openNew() {
        this.router.navigate(['/manage-modalites/new-modality']);
    }

    toggleStatus(modality: Modality) {
        this.errorMessage = '';
        try {
            this.store.setActive(modality.id, !modality.active);
            this.modalities = this.store.list();
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Falha ao mudar o status.';
        }
    }
}