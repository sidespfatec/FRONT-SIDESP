import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardModule } from 'primeng/card';
import { NewsItem } from '../news.model';

@Component({
    selector: 'app-card-news',
    standalone: true,
    imports: [CardModule],
    templateUrl: './card-news.component.html',
    styleUrl: './card-news.component.scss',
})


export class CardNewsComponent {

    //quando o click é igual a true abre a noticia com a descrição e as informações.
    @Input({ required: true }) news!: NewsItem;

    @Output() openNews = new EventEmitter<NewsItem>();
}