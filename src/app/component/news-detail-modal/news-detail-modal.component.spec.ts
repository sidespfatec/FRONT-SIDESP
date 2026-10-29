import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDetailModalComponent } from './news-detail-modal.component';
import { NewsItem } from '../news.model';

const NOTICIA: NewsItem = {
  id: 1,
  title: 'Notícia de teste',
  description: 'Descrição usada apenas no teste.',
  image: 'https://exemplo.test/imagem.png',
  date: new Date('2026-01-01T12:00:00Z'),
};

describe('NewsDetailModalComponent', () => {
  let component: NewsDetailModalComponent;
  let fixture: ComponentFixture<NewsDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsDetailModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('news', NOTICIA);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
