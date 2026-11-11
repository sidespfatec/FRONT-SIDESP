import { DatePipe, Location } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FooterComponent } from '../../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../../component/navbar-desktop-admin/navbar-desktop-admin.component';
import { NewsItem } from '../../../../component/news.model';
import { NewsService } from '../../../../services/news.service';

type LoadStatus = 'loading' | 'ready' | 'not-found' | 'error';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, FooterComponent, NavbarDesktopAdminComponent],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss',
})
export class NewsDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly newsService = inject(NewsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly retryRequested = new Subject<void>();

  readonly status = signal<LoadStatus>('loading');
  readonly news = signal<NewsItem | null>(null);
  readonly shareFeedback = signal('');

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.retryRequested.pipe(startWith(undefined)),
    ]).pipe(
      switchMap(([params]) => {
        this.status.set('loading');
        this.news.set(null);
        this.shareFeedback.set('');

        const idText = params.get('id');
        const id = Number(idText);
        if (!idText || !/^[1-9]\d*$/.test(idText) || !Number.isSafeInteger(id)) {
          return of({ status: 'not-found' as LoadStatus, news: null });
        }

        return this.newsService.getPublishedById(id).pipe(
          map((news) => ({
            status: (news ? 'ready' : 'not-found') as LoadStatus,
            news,
          })),
          catchError(() => of({ status: 'error' as LoadStatus, news: null })),
        );
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((result) => {
      this.news.set(result.news);
      this.status.set(result.status);
    });
  }

  retry(): void {
    this.retryRequested.next();
  }

  async shareNews(): Promise<void> {
    const article = this.news();
    if (!article || typeof navigator === 'undefined') return;

    const path = this.router.serializeUrl(
      this.router.createUrlTree(['/noticias', article.id])
    );
    // Location considera o baseHref do SIDESP (inclusive no GitHub Pages).
    const url = new URL(this.location.prepareExternalUrl(path), document.baseURI).href;

    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
        this.shareFeedback.set('Notícia compartilhada.');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        // Continua para a cópia do endereço se o compartilhamento não funcionar.
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        this.shareFeedback.set('Link copiado!');
        return;
      } catch {
        // Navegadores sem permissão de copiar ainda permitem seleção manual.
      }
    }

    this.shareFeedback.set(`Copie o endereço da notícia: ${url}`);
  }
}
