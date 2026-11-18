import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { NewNews, NewsItem, estaVisivel, ordenarPorData } from './news.model';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class NewsService {

  noticias = signal<NewsItem[]>([]);
  carregando = signal(false);
  erro = signal<string | null>(null);

  constructor(private http: HttpClient) { }

  buscarNoticias(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.get<NewsItem[]>(`${API}/noticias`).subscribe({
      next: (lista) => {
        this.noticias.set(lista);
        this.carregando.set(false);
      },
      error: (falha: HttpErrorResponse) => {
        this.erro.set(this.explicarErro(falha));
        this.carregando.set(false);
      }
    });
  }

  criarNoticia(nova: NewNews): void {
    const antes = this.noticias();

    // Aparece na hora com id provisório; o back devolve o definitivo.
    const provisoria: NewsItem = { ...nova, id: Date.now() };
    this.noticias.update(lista => [provisoria, ...lista]);

    this.http.post<NewsItem>(`${API}/noticias`, nova).subscribe({
      next: (salva) => this.noticias.update(lista =>
        lista.map(item => item.id === provisoria.id ? salva : item)
      ),
      error: (falha: HttpErrorResponse) => {
        this.noticias.set(antes);
        this.erro.set(this.explicarErro(falha));
      }
    });
  }

  /** O que a home mostra: sem as vencidas, da mais nova para a mais antiga. */
  get visiveis(): NewsItem[] {
    return ordenarPorData(this.noticias().filter(item => estaVisivel(item)));
  }

  private explicarErro(falha: HttpErrorResponse): string {
    if (falha.status === 0) { return 'Sem conexão com o servidor.'; }
    if (falha.status === 403) { return 'Você não tem permissão para publicar notícias.'; }
    return falha.error?.mensagem ?? 'Não foi possível carregar as notícias.';
  }
}
