
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsItem, NoticiaCriada, NoticiaDados, ordenarPorData } from './news.model';

const API = '/api/v1';
const API_IMAGENS = `${API}/noticias/imagens`;

interface NoticiaApi {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string;
  dataPublicacao: string;
}

@Injectable({ providedIn: 'root' })
export class NewsService {

  noticias = signal<NewsItem[]>([]);
  carregando = signal(false);

  erro = signal<string | null>(null);
  indisponivel = signal(false);

  constructor(private http: HttpClient) { }

  buscarNoticias(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.get<NoticiaApi[]>(`${API}/noticias`).subscribe({
      next: (lista) => {

        const noticiasConvertidas: NewsItem[] = lista.map(noticia => ({
          id: noticia.id,
          title: noticia.titulo,
          description: noticia.conteudo,
          image: `${API_IMAGENS}/${encodeURIComponent(noticia.imagem)}`,
          date: noticia.dataPublicacao
        }));

        this.noticias.set(noticiasConvertidas);
        this.indisponivel.set(false);
        this.carregando.set(false);
      },

      error: (falha: HttpErrorResponse) => {
        this.indisponivel.set(true);
        this.carregando.set(false);
        console.warn('GET /noticias falhou com', falha.status);
      }
    });
  }

  criarNoticia(dados: NoticiaDados, imagem: File): Observable<NoticiaCriada> {
    return this.http.post<NoticiaCriada>(
      `${API}/admin/noticias`,
      this.montarFormulario(dados, imagem)
    );
  }

  adicionarNaLista(item: NewsItem): void {
    this.noticias.update(lista => [item, ...lista]);
  }

  get visiveis(): NewsItem[] {
    return ordenarPorData(this.noticias());
  }

  registrarErro(falha: HttpErrorResponse): string {
    const texto = this.explicarErro(falha);
    this.erro.set(texto);
    return texto;
  }

  private montarFormulario(dados: NoticiaDados, imagem: File): FormData {
    const formulario = new FormData();

    formulario.append(
      'dados',
      new Blob([JSON.stringify(dados)], { type: 'application/json' })
    );

    formulario.append('imagem', imagem, imagem.name);

    return formulario;
  }

  private explicarErro(falha: HttpErrorResponse): string {
    if (falha.status === 0) {
      return 'Sem conexão com o servidor.';
    }

    if (falha.status === 401) {
      return 'Sua sessão expirou. Entre novamente.';
    }

    if (falha.status === 403) {
      return 'Só administrador pode publicar notícias.';
    }

    if (falha.status === 413) {
      return 'Imagem grande demais. O limite é 10 MB.';
    }

    return falha.error?.mensagem ?? 'Não foi possível concluir a operação.';
  }
}
