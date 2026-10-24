import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { NewsItem } from '../news.model';

@Component({
  selector: 'app-news-detail-modal',
  standalone: true,
  imports: [DialogModule, DatePipe],
  templateUrl: './news-detail-modal.component.html',
  styleUrl: './news-detail-modal.component.scss',
})
export class NewsDetailModalComponent {
  @Input({ required: true }) news!: NewsItem;
  @Output() close = new EventEmitter<void>();
}