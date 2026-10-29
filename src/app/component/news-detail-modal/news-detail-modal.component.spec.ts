import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDetailModalComponent } from './news-detail-modal.component';

describe('NewsDetailModalComponent', () => {
  let component: NewsDetailModalComponent;
  let fixture: ComponentFixture<NewsDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsDetailModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsDetailModalComponent);
    fixture.componentRef.setInput('news', {
      id: 1,
      title: 'Notícia de teste',
      description: 'Conteúdo fictício para verificar o componente.',
      image: '',
      date: new Date('2026-01-01T12:00:00Z'),
    });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
