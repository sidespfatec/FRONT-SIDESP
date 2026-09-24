import { Component } from '@angular/core';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NewCardNewsComponent } from '../../../../component/new-card-news/new-card-news.component';
import { CardNewsComponent } from '../../../../component/card-news/card-news.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

@Component({
  selector: 'app-home',
  imports: [BannerComponent, FooterComponent, NewCardNewsComponent, CardNewsComponent, NavbarDesktopAdminComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  viewModal: boolean = false;

  openModal() {
    this.viewModal = true;
  }

  closeModal() {
    this.viewModal = false;
  }

}
