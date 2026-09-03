import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../../component/banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FooterComponent } from '../../../component/footer/footer.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';

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
    standalone: true,
    imports: [
        CommonModule, BannerComponent,
        ButtonModule, InputTextModule, FooterComponent,
        AutoCompleteModule, CardModule
    ],
    templateUrl: './manage-modalites.component.html',
    styleUrl: './manage-modalites.component.scss'
})
export class ManageModalitesComponent {

    constructor(private router: Router) { }

    filter: 'active' | 'inactive' = 'active';

    modalities: Modality[] = [
        { id: '1', name: 'Futsal Sub-15', icon: 'pi pi-circle-fill', iconBg: '#EAF1FB', iconColor: '#2563A8', classesCount: 3, studentsCount: 45, active: true },
        { id: '2', name: 'Natação Adulto', icon: 'pi pi-circle-fill', iconBg: '#E1F5EE', iconColor: '#0F7A4E', classesCount: 2, studentsCount: 43, active: true },
        { id: '3', name: 'Vôlei', icon: 'pi pi-circle-fill', iconBg: '#FAEEDA', iconColor: '#8A5A00', classesCount: 2, studentsCount: 31, active: true },
        { id: '4', name: 'Ginástica', icon: 'pi pi-circle-fill', iconBg: '#F1EFEC', iconColor: '#6B6558', classesCount: 2, studentsCount: 30, active: false }
    ];

    get filteredModalities(): Modality[] {
        return this.modalities.filter(m => this.filter === 'active' ? m.active : !m.active);
    }

    setFilter(filter: 'active' | 'inactive'): void {
        this.filter = filter;
    }

    openModality(modality: Modality): void {
        this.router.navigate(['/manage-modalites', modality.id, 'classes']);
    }
}