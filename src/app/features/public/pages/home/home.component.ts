import { AuthService } from '../../../../core/auth/auth.service';
import { SessionComponent } from '../../../../core/auth/session.component';
import { Component, inject } from '@angular/core';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NewCardNewsComponent } from '../../../../component/new-card-news/new-card-news.component';
import { CardNewsComponent } from '../../../../component/card-news/card-news.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { NewsDetailModalComponent } from '../../../../component/news-detail-modal/news-detail-modal.component';
import { NewsItem } from '../../../../component/news.model';

@Component({
  selector: 'app-home',
  imports: [
    SessionComponent, BannerComponent, FooterComponent, NewCardNewsComponent,
    CardNewsComponent, NavbarDesktopAdminComponent, NewsDetailModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  auth=inject(AuthService);
  constructor(){if(this.auth.token())this.auth.me().subscribe({error:()=>this.auth.clear()});}

  viewModal: boolean = false;
  selectedNews: NewsItem | null = null;

  newsList: NewsItem[] = [
    {
      id: 1,
      title: 'Venha conhecer o novo sistema da Secretaria de Esportes!',
      description: 'Agora você pode se inscrever nas modalidades, acompanhar sua frequência e muito mais, tudo em um só lugar.',
      image: 'https://tse3.mm.bing.net/th/id/OIP.3y6O6dX2lJJMUbb8OZJvNQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      date: new Date(),
    },
  ];

  openModal() {
    if(this.auth.isAdmin()) this.viewModal = true;
  }

  closeModal() {
    this.viewModal = false;
  }

  openNews(news: NewsItem) {
    this.selectedNews = news;
  }

  closeNews() {
    this.selectedNews = null;
  }

  addNews(news: NewsItem) {
    this.newsList = [news, ...this.newsList];
  }
}