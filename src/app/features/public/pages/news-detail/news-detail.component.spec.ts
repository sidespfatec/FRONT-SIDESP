import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NewsDetailComponent } from './news-detail.component';
import { NewsService } from '../../../../services/news.service';
import { NewsItem } from '../../../../component/news.model';

describe('NewsDetailComponent (PB26)', () => {
  let router: Router;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([
        { path: 'noticias/:id', component: NewsDetailComponent },
        { path: 'home', component: NewsDetailComponent },
      ])],
    }).compileComponents();
    router = TestBed.inject(Router);
    harness = await RouterTestingHarness.create();
  });

  it('abre notícia publicada pelo endereço direto', async () => {
    await harness.navigateByUrl('/noticias/1', NewsDetailComponent);
    await new Promise((resolve) => setTimeout(resolve, 200));
    harness.detectChanges();
    const component = harness.routeDebugElement?.componentInstance as NewsDetailComponent;
    expect(component.status()).toBe('ready');
    expect(component.news()?.id).toBe(1);
    expect(harness.routeNativeElement?.textContent).toContain('Publicado em');
  });

  it('não exibe notícia indisponível ao acessar endereço direto', async () => {
    const hidden: NewsItem = {
      id: 99, title: 'Rascunho', description: 'Não mostrar', image: '',
      date: new Date('2026-10-26T12:00:00-03:00'), published: false,
    };
    TestBed.inject(NewsService).addDemoNews(hidden);
    await harness.navigateByUrl('/noticias/99', NewsDetailComponent);
    await new Promise((resolve) => setTimeout(resolve, 200));
    harness.detectChanges();
    const component = harness.routeDebugElement?.componentInstance as NewsDetailComponent;
    expect(component.status()).toBe('not-found');
    expect(harness.routeNativeElement?.textContent).toContain('Notícia não encontrada');
    expect(harness.routeNativeElement?.textContent).not.toContain('Não mostrar');
  });

  it('oferece mensagem para ID inexistente', async () => {
    await harness.navigateByUrl('/noticias/invalido', NewsDetailComponent);
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Notícia não encontrada');
  });
});
