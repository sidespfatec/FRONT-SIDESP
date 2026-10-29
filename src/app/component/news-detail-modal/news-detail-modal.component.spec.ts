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
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
