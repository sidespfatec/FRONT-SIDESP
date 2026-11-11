import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { HomeComponent } from './home.component';
import { NewsService } from '../../../../services/news.service';

describe('HomeComponent (PB26)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('abre a rota da notícia ao clicar no card', async () => {
    const component = TestBed.createComponent(HomeComponent).componentInstance;
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);
    const news = TestBed.inject(NewsService).publishedNews()[0];

    component.openNews(news);
    expect(navigate).toHaveBeenCalledWith(['/noticias', news.id]);
  });
});
