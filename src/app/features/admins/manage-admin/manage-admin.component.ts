import { Component } from '@angular/core';
import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { ProfessionalListComponent } from '../../../component/professional-list/professional-list.component';
@Component({
  selector: 'app-manage-admin',
  standalone: true,
  imports: [
    BannerComponent,
    FooterComponent,
    NavbarDesktopAdminComponent,
    ProfessionalListComponent,
  ],
  templateUrl: './manage-admin.component.html',
  styleUrl: './manage-admin.component.scss',
})
export class ManageAdminComponent {}
