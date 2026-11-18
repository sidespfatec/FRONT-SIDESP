import { Component, OnInit } from '@angular/core';
import { NewCardNewsComponent } from '../../../../component/new-card-news/new-card-news.component';
import { CardNewsComponent } from '../../../../component/card-news/card-news.component';
import { NewsDetailModalComponent } from '../../../../component/news-detail-modal/news-detail-modal.component';
import { NewNews, NewsItem } from '../../../../component/news.model';
import { NewsService } from '../../../../component/news.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    NewCardNewsComponent,
    CardNewsComponent, NewsDetailModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  viewModal: boolean = false;
  selectedNews: NewsItem | null = null;

  constructor(
    private service: NewsService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.service.buscarNoticias();
  }

  //já vem sem as vencidas e da mais nova para a mais antiga
  get newsList(): NewsItem[] {
    return this.service.visiveis;
  }

  get carregando(): boolean {
    return this.service.carregando();
  }

  get erro(): string | null {
    return this.service.erro();
  }

  //só administrador publica notícia
  get podePublicar(): boolean {
    return this.auth.ehAdministrador;
  }


  //abre e fecha a modal do app-new-card-news
  openModal() {
    this.viewModal = true;
  }

  closeModal() {
    this.viewModal = false;
  }

  //abrir e fechar modal de "saiba mais" da notícia
  openNews(news: NewsItem) {
    this.selectedNews = news;
  }

  closeNews() {
    this.selectedNews = null;
  }

  //manda para a API; o id quem gera é o back
  addNews(news: NewNews) {
    this.service.criarNoticia(news);
  }
}
