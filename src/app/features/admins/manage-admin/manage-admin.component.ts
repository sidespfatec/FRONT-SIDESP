import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../../component/banner/banner.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FooterComponent } from '../../../component/footer/footer.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

@Component({
    selector: 'app-manage-admin',
    standalone: true,
    imports: [
        CommonModule, BannerComponent,
        ButtonModule, InputTextModule, FooterComponent,
        AutoCompleteModule, CardModule , NavbarDesktopAdminComponent
    ],
    templateUrl: './manage-admin.component.html',
    styleUrl: './manage-admin.component.scss'
})
export class ManageAdminComponent {

    showModal = false;

}