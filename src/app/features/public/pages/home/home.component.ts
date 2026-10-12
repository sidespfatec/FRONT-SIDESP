import { AuthService } from '../../../../core/auth/auth.service';
import { SessionComponent } from '../../../../core/auth/session.component';
import { Component, inject } from '@angular/core';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NewCardNewsComponent } from '../../../../component/new-card-news/new-card-news.component';
import { CardNewsComponent } from '../../../../component/card-news/card-news.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

@Component({
  selector: 'app-home',
  imports: [SessionComponent, BannerComponent, FooterComponent, NewCardNewsComponent, CardNewsComponent, NavbarDesktopAdminComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  auth=inject(AuthService);
  constructor(){if(this.auth.token())this.auth.me().subscribe({error:()=>this.auth.clear()});}

  viewModal: boolean = false;

  openModal() {
    if(this.auth.isAdmin()) this.viewModal = true;
  }

  closeModal() {
    this.viewModal = false;
  }

}
