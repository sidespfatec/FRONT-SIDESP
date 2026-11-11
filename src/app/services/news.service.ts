import { computed, Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { NewsItem } from '../component/news.model';

/**
 * Fonte TEMPORÁRIA de dados de notícias para demonstração do frontend PB26.
 * Quando o backend da PB25 estiver disponível, substituir esta fonte pelos endpoints
 * que entregam somente notícias publicadas (RN021) - inclusive na consulta por ID.
 * Os novos registros criados na tela existem apenas durante a sessão atual do app.
 */
@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly entries = signal<NewsItem[]>([
    {
      id: 1,
      title: 'Venha conhecer o novo sistema da Secretaria de Esportes!',
      description: 'Agora você pode se inscrever nas modalidades, acompanhar sua frequência e muito mais, tudo em um só lugar.',
      image: 'https://tse3.mm.bing.net/th/id/OIP.3y6O6dX2lJJMUbb8OZJvNQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
      date: new Date(),
      published: true,
    },
  ]);

  /** Notícias visíveis na tela inicial; rascunhos e agendadas não aparecem. */
  readonly publishedNews = computed(() =>
    this.entries().filter((news) => this.isPublished(news))
  );

  /** Demonstração de uma consulta assíncrona. Não realiza requisição HTTP. */
  getPublishedById(id: number): Observable<NewsItem | null> {
    const article = this.publishedNews().find((news) => news.id === id) ?? null;
    return of(article).pipe(delay(150));
  }

  /** Preserva o formulário existente de inclusão de notícias (somente memória). */
  addDemoNews(news: NewsItem): void {
    this.entries.update((items) => [news, ...items.filter((item) => item.id !== news.id)]);
  }

  private isPublished(news: NewsItem): boolean {
    return news.published === true &&
      news.date instanceof Date &&
      Number.isFinite(news.date.getTime()) &&
      news.date.getTime() <= Date.now();
  }
}
