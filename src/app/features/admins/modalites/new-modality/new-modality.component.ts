import { ChangeDetectorRef } from '@angular/core';
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
import { ModalityService } from '../services/modality.service';
import { HubService } from '../../manage-hubs/services/hub.service';
import { Hub } from '../../../../core/models/management.models';
import { finalize } from 'rxjs';

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
    private changeDetector = inject(ChangeDetectorRef);
    private router = inject(Router);
    private api = inject(ModalityService);
    private hubApi = inject(HubService);
    busy = false;

    name = '';
    icon = 'pi pi-circle-fill';
    minAge: number | null = null;
    maxAge: number | null = null;
    monthlyAbsenceLimit: number | null = null;
    hubId: number | null = null;
    errorMessage = '';

    hubs: Hub[] = [];
    ngOnInit() {
        this.hubApi.list('', true).subscribe({
            next: hubs => { this.hubs = hubs; this.changeDetector.markForCheck(); },
            error: e => { this.errorMessage = e.error?.mensagem || 'Não foi possível carregar os polos.'; this.changeDetector.markForCheck(); }
        });
    }

    icons = [
        { label: 'Padrão', value: 'pi pi-circle-fill' },
        { label: 'Estrela', value: 'pi pi-star' },
        { label: 'Coração', value: 'pi pi-heart' },
        { label: 'Raio', value: 'pi pi-bolt' },
        { label: 'Grupo', value: 'pi pi-users' }
    ];

    cancel() {
        this.router.navigate(['/manage-modalites']);
    }

    save() {
        this.errorMessage = '';
        if (this.minAge === null || this.maxAge === null || this.monthlyAbsenceLimit === null) {
            this.errorMessage = 'Informe as idades e o limite de faltas.';
            return;
        }
        if (this.busy) return;
        if (!this.name.trim() || this.hubId === null || this.minAge > this.maxAge) {
            this.errorMessage = 'Informe o nome, um polo ativo e uma faixa etária válida.';
            return;
        }
        this.busy = true;
        this.api.create({nome: this.name.trim(), idadeMinima: this.minAge, idadeMaxima: this.maxAge,
            limiteFaltasMensais: this.monthlyAbsenceLimit, poloId: this.hubId})
            .pipe(finalize(() => { this.busy = false; this.changeDetector.markForCheck(); })).subscribe({
                next: () => void this.router.navigate(['/manage-modalites']),
                error: e => this.errorMessage = e.error?.mensagem || 'Não foi possível cadastrar.'
            });
    }
}
