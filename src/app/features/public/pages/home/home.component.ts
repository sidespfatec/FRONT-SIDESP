import { Component } from '@angular/core';
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
    BannerComponent, FooterComponent, NewCardNewsComponent,
    CardNewsComponent, NavbarDesktopAdminComponent, NewsDetailModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  viewModal: boolean = false;
  selectedNews: NewsItem | null = null;

  newsList: NewsItem[] = [];

  openModal() {
    this.viewModal = true;
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
    // A listagem só será atualizada após publicação confirmada pelo servidor.
  }
}