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
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-new-modality',
    imports: [
        FormsModule, BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        CardModule, ButtonModule, InputTextModule, SelectModule, ToggleSwitchModule
    ],
    templateUrl: './new-modality.component.html',
    styleUrl: './new-modality.component.scss'
})
export class NewModalityComponent {
    private router = inject(Router);

    name = '';
    icon = '';
    active = true;

    icons = [
        { label: 'Estrela', value: 'pi pi-star' },
        { label: 'Coração', value: 'pi pi-heart' },
        { label: 'Raio', value: 'pi pi-bolt' },
        { label: 'Grupo', value: 'pi pi-users' }
    ];

    cancel() {
        this.router.navigate(['/manage-modalites']);
    }

    save() {
        this.router.navigate(['/manage-modalites']);
    }
}