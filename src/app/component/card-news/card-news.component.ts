import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { NewsItem } from '../news.model';

@Component({
    selector: 'app-card-news',
    standalone: true,
    imports: [CardModule, DatePipe],
    templateUrl: './card-news.component.html',
    styleUrl: './card-news.component.scss',
})
export class CardNewsComponent {
    @Input({ required: true }) news!: NewsItem;

    //liga os botões de arquivar e apagar
    @Input() gerenciar = false;

    @Output() openNews = new EventEmitter<NewsItem>();
    @Output() arquivar = new EventEmitter<NewsItem>();
    @Output() apagar = new EventEmitter<NewsItem>();

    //apagar não pode ser um clique só
    confirmando = false;

    //o card inteiro abre a notícia, então os botões precisam segurar o clique
    aoClicar(evento: Event): void {
        evento.stopPropagation();
    }
}
