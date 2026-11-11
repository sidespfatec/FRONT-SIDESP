import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NewsItem } from '../component/news.model';
import { NewsService } from './news.service';

describe('NewsService (demonstração PB26)', () => {
  let service: NewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsService);
  });

  const sample = (id: number, published: boolean, date = new Date('2026-10-26T12:00:00-03:00')): NewsItem => ({
    id, title: `Notícia ${id}`, description: 'Conteúdo completo', image: 'imagem.jpg', date, published,
  });

  it('lista apenas notícias publicadas e já liberadas', () => {
    service.addDemoNews(sample(20, false));
    service.addDemoNews(sample(21, true, new Date('2099-01-01T00:00:00Z')));
    service.addDemoNews(sample(22, true));

    const ids = service.publishedNews().map((item) => item.id);
    expect(ids).toContain(22);
    expect(ids).not.toContain(20);
    expect(ids).not.toContain(21);
  });

  it('impede acesso pelo ID a uma notícia não publicada (simulação RN021)', fakeAsync(() => {
    service.addDemoNews(sample(30, false));
    let result: NewsItem | null | undefined;
    service.getPublishedById(30).subscribe((news) => result = news);
    tick(200);
    expect(result).toBeNull();
  }));

  it('permite acesso pelo ID a uma notícia publicada', fakeAsync(() => {
    service.addDemoNews(sample(31, true));
    let result: NewsItem | null | undefined;
    service.getPublishedById(31).subscribe((news) => result = news);
    tick(200);
    expect(result?.id).toBe(31);
  }));
});
