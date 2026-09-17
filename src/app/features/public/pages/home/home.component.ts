import { Component } from '@angular/core';
import { BannerComponent } from '../../../../component/banner/banner.component';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { CardNewsComponent } from '../../../../component/card-news/card-news.component';

@Component({
  selector: 'app-home',
  imports: [BannerComponent, FooterComponent, CardNewsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent { }
