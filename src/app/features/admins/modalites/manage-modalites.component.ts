import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

interface Modality {
    id: string;
    name: string;
    icon: string;
    iconBg: string;
    iconColor: string;
    classesCount: number;
    studentsCount: number;
    active: boolean;
}

@Component({
    selector: 'app-manage-modalites',
    imports: [
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        CardModule, ButtonModule, InputTextModule, FormsModule, SelectButtonModule
    ],
    templateUrl: './manage-modalites.component.html',
    styleUrl: './manage-modalites.component.scss'
})
export class ManageModalitesComponent {
    private router = inject(Router);

    filter: 'active' | 'inactive' = 'active';

    modalities: Modality[] = [
        { id: '1', name: 'Futsal Sub-15', icon: 'pi pi-circle-fill', iconBg: '#EAF1FB', iconColor: '#2563A8', classesCount: 3, studentsCount: 45, active: true },
        { id: '2', name: 'Natação Adulto', icon: 'pi pi-circle-fill', iconBg: '#E1F5EE', iconColor: '#0F7A4E', classesCount: 2, studentsCount: 43, active: true },
        { id: '3', name: 'Vôlei', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: true },
        { id: '4', name: 'Ginástica', icon: 'pi pi-circle-fill', iconBg: '#F1EFEC', iconColor: '#6B6558', classesCount: 2, studentsCount: 30, active: false },
        { id: '5', name: 'Tênis', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: true },
        { id: '6', name: 'Basquete', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: false },
        { id: '7', name: 'Xadrez', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: true }
    ];

    get filteredModalities(): Modality[] {
        return this.modalities.filter(m => m.active === (this.filter === 'active'));
    }

    filterOptions = [
        { label: 'Ativas', value: 'active' },
        { label: 'Inativas', value: 'inactive' }
    ];

    openModality(modality: Modality) {
        this.router.navigate(['/manage-modalites', modality.id, 'classes']);
    }

    openNew() {
        this.router.navigate(['/manage-modalites/new-modality']);
    }
}