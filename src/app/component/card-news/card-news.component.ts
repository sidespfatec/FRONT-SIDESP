import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-card-news',
    standalone: true,
    imports: [CardModule],
    templateUrl: './card-news.component.html',
    styleUrl: './card-news.component.scss',
})

export class CardNewsComponent { } 
