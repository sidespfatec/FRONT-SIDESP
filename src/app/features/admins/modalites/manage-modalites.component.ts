import { ChangeDetectorRef } from '@angular/core';
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
import { ModalityService } from './services/modality.service';
import { HubService } from '../manage-hubs/services/hub.service';
import { Modality as ApiModality } from '../../../core/models/management.models';
import { forkJoin, finalize } from 'rxjs';
interface Modality extends ApiModality { classesCount: number | null; studentsCount: number | null; name: string; active: boolean; hubName?: string; minAge: number | null; maxAge: number | null; monthlyAbsenceLimit: number | null; icon: string; iconBg: string; iconColor: string; }

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
    private changeDetector = inject(ChangeDetectorRef);
    private router = inject(Router);
    private api = inject(ModalityService);
    private hubs = inject(HubService);
    busy = false;

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

    ngOnInit() { this.load(); }

    load() {
        this.busy = true;
        forkJoin({ modalities: this.api.list(), hubs: this.hubs.list() })
            .pipe(finalize(() => { this.busy = false; this.changeDetector.markForCheck(); })).subscribe({
                next: ({modalities, hubs}) => {
                    this.modalities = modalities.map(m => ({...m, name: m.nome, active: m.ativo,
                        hubName: hubs.find(h => h.id === m.poloId)?.nome,
                        minAge: m.idadeMinima, maxAge: m.idadeMaxima,
                        monthlyAbsenceLimit: m.limiteFaltasMensais,
                        classesCount: null, studentsCount: null, icon: 'pi pi-circle-fill', iconBg: '#e8f4ee', iconColor: '#28734d'}));
                },
                error: e => this.errorMessage = e.error?.mensagem || 'Não foi possível carregar as modalidades.'
            });
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
        if (this.selected) void this.router.navigate(['/manage-modalites', this.selected.id, 'classes']);
    }
    deleteSelected() { this.errorMessage = 'Modalidades são inativadas para preservar o histórico.'; }
    openNew() {
        this.router.navigate(['/manage-modalites/new-modality']);
    }

    toggleStatus(modality: Modality) {
        if (this.busy) return;
        this.errorMessage = '';
        this.busy = true;
        this.api.status(modality.id, !modality.active).pipe(finalize(() => { this.busy = false; this.changeDetector.markForCheck(); })).subscribe({
            next: () => { this.closeDetails(); this.load(); },
            error: e => this.errorMessage = e.error?.mensagem || 'Não foi possível alterar a situação.'
        });
    }
}
