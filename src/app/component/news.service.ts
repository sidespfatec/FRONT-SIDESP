import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { NewsItem, NoticiaCriada, NoticiaDados, ordenarPorData } from './news.model';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class NewsService {

  noticias = signal<NewsItem[]>([]);
  carregando = signal(false);

  /** Erro ao PUBLICAR. Aparece em cima da lista. */
  erro = signal<string | null>(null);

  /** O GET não respondeu. Não é erro do usuário, então não vira alerta. */
  indisponivel = signal(false);

  constructor(private http: HttpClient) { }

  //⚠ este GET ainda não existe no back: só o POST foi implementado
  buscarNoticias(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.http.get<NewsItem[]>(`${API}/noticias`).subscribe({
      next: (lista) => {
        this.noticias.set(lista);
        this.carregando.set(false);
      },
      error: (falha: HttpErrorResponse) => {
        //ler notícia é público: 401/403/404 aqui só quer dizer que o
        //endpoint ainda não existe, não que a pessoa fez algo errado
        this.indisponivel.set(true);
        this.carregando.set(false);
        console.warn('GET /noticias falhou com', falha.status);
      }
    });
  }

  /**
   * Devolve o Observable em vez de dar subscribe aqui: quem decide o que
   * fazer depois (fechar a modal, mostrar o erro) é a tela.
   */
  criarNoticia(dados: NoticiaDados, imagem: File): Observable<NoticiaCriada> {
    return this.http.post<NoticiaCriada>(`${API}/admin/noticias`, this.montarFormulario(dados, imagem));
  }

  /** Põe a notícia na tela sem esperar um GET que ainda não existe. */
  adicionarNaLista(item: NewsItem): void {
    this.noticias.update(lista => [item, ...lista]);
  }

  /** Da mais nova para a mais antiga. */
  get visiveis(): NewsItem[] {
    return ordenarPorData(this.noticias());
  }

  registrarErro(falha: HttpErrorResponse): string {
    const texto = this.explicarErro(falha);
    this.erro.set(texto);
    return texto;
  }

  /**
   * 'dados' precisa ir como Blob application/json: o @RequestPart do Spring
   * recusa se o campo chegar como texto puro.
   * Não definimos Content-Type: o navegador gera o boundary do multipart.
   */
  private montarFormulario(dados: NoticiaDados, imagem: File): FormData {
    const formulario = new FormData();
    formulario.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
    formulario.append('imagem', imagem, imagem.name);
    return formulario;
  }

  private explicarErro(falha: HttpErrorResponse): string {
    if (falha.status === 0) { return 'Sem conexão com o servidor.'; }
    if (falha.status === 401) { return 'Sua sessão expirou. Entre novamente.'; }
    if (falha.status === 403) { return 'Só administrador pode publicar notícias.'; }
    if (falha.status === 413) { return 'Imagem grande demais. O limite é 10 MB.'; }
    return falha.error?.mensagem ?? 'Não foi possível concluir a operação.';
  }
}
