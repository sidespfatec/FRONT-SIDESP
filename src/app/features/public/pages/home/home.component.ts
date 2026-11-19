import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NewCardNewsComponent } from '../../../../component/new-card-news/new-card-news.component';
import { CardNewsComponent } from '../../../../component/card-news/card-news.component';
import { NewsDetailModalComponent } from '../../../../component/news-detail-modal/news-detail-modal.component';
import { NewsItem, NoticiaParaEnviar } from '../../../../component/news.model';
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
  salvando = false;

  constructor(
    private service: NewsService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.service.buscarNoticias();
  }

  //já vem da mais nova para a mais antiga
  get newsList(): NewsItem[] {
    return this.service.visiveis;
  }

  get carregando(): boolean {
    return this.service.carregando();
  }

  get erro(): string | null {
    return this.service.erro();
  }

  //a lista vazia tem dois motivos diferentes, e o texto muda
  get avisoDaLista(): string {
    if (this.carregando) { return 'Carregando notícias...'; }
    if (this.service.indisponivel()) { return 'As notícias ainda não estão disponíveis.'; }
    return 'Nenhuma notícia publicada no momento.';
  }

  //so administrador publica: /api/v1/admin/** exige esse papel no back
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

  //manda para a API; só fecha a modal quando o back confirma
  addNews(envio: NoticiaParaEnviar) {
    this.salvando = true;

    this.service.criarNoticia(envio.dados, envio.imagem).subscribe({
      next: () => {
        this.salvando = false;
        this.viewModal = false;

        //busca de novo em vez de montar o card aqui: assim a tela mostra
        //o que o back realmente salvou, com a imagem servida por ele
        this.service.buscarNoticias();
      },
      error: (falha: HttpErrorResponse) => {
        this.salvando = false;
        this.service.registrarErro(falha);
      }
    });
  }
}
