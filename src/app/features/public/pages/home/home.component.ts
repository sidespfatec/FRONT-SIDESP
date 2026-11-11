import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NewCardNewsComponent } from '../../../../component/new-card-news/new-card-news.component';
import { CardNewsComponent } from '../../../../component/card-news/card-news.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { NewsItem } from '../../../../component/news.model';
import { NewsService } from '../../../../services/news.service';

@Component({
  selector: 'app-home',
  imports: [
    BannerComponent, FooterComponent, NewCardNewsComponent,
    CardNewsComponent, NavbarDesktopAdminComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly newsService = inject(NewsService);

  viewModal = false;
  readonly newsList = this.newsService.publishedNews;

  openModal(): void {
    this.viewModal = true;
  }

  closeModal(): void {
    this.viewModal = false;
  }

  openNews(news: NewsItem): void {
    // Página com endereço próprio para compartilhamento (PB26).
    void this.router.navigate(['/noticias', news.id]);
  }

  addNews(news: NewsItem): void {
    this.newsService.addDemoNews(news);
  }
}
