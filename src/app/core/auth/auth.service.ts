// SERVICE DE AUTENTICAÇÃO
// Guarda QUEM está logado. É o único lugar que fala com /auth e o único que
// encosta no localStorage.

import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

import { Credenciais, Me, Perfil, RespostaLogin } from './auth.model';

const API = '/api/v1';

// Os nomes das gavetas no localStorage. Constantes para não escrever o texto
// errado em um dos lugares e passar meia hora procurando.
const CHAVE_TOKEN = 'sidesp.token';
const CHAVE_PERFIL = 'sidesp.perfil';
const CHAVE_NOME = 'sidesp.nome';
const CHAVE_EXPIRA = 'sidesp.expira';


@Injectable({ providedIn: 'root' })
export class AuthService {


    private ehNavegador = isPlatformBrowser(inject(PLATFORM_ID));

    token = signal<string | null>(null);
    perfil = signal<Perfil | null>(null);
    nome = signal<string>('');

    /** Resposta do /auth/me. null = ainda não buscado, ou falhou. */
    me = signal<Me | null>(null);

    constructor(private http: HttpClient) {
        // Ao abrir o app, recupera a sessão de quem já tinha entrado.
        this.recuperarSessao();
    }


    // ENTRAR E SAIR

    /**
     * Faz o login.
     *
     * Repare que este método DEVOLVE o Observable em vez de dar subscribe
     * aqui dentro, como os outros services fazem. O motivo: quem decide o
     * que acontece depois do login é a tela (ir pra onde, mostrar qual
     * erro). O service só sabe guardar a sessão.
     *
     * O tap() é um "de passagem": ele roda quando a resposta chega, guarda
     * a sessão, e deixa a resposta seguir para quem deu subscribe.
     */
    login(credenciais: Credenciais): Observable<RespostaLogin> {
        return this.http.post<RespostaLogin>(`${API}/auth/login`, credenciais).pipe(
            tap(resposta => this.guardarSessao(resposta))
        );
    }

    /** Apaga a sessão. Não navega: quem navega é quem chamou. */
    sair(): void {
        this.token.set(null);
        this.perfil.set(null);
        this.nome.set('');
        this.me.set(null);

        if (this.ehNavegador) {
            localStorage.removeItem(CHAVE_TOKEN);
            localStorage.removeItem(CHAVE_PERFIL);
            localStorage.removeItem(CHAVE_NOME);
            localStorage.removeItem(CHAVE_EXPIRA);
        }
    }



    // PERGUNTAS QUE O RESTO DO APP FAZ

    /** Tem token e ele ainda não venceu. */
    get estaLogado(): boolean {
        return this.token() !== null;
    }

    /** Verdadeiro para os dois tipos de administrador. */
    get ehAdministrador(): boolean {
        const p = this.perfil();
        return p === 'ADMINISTRADOR_TOTAL' || p === 'ADMINISTRADOR_PARCIAL';
    }

    get ehProfessor(): boolean {
        return this.perfil() === 'PROFESSOR';
    }

    get ehAluno(): boolean {
        return this.perfil() === 'ALUNO';
    }

    get ehResponsavel(): boolean {
        return this.perfil() === 'RESPONSAVEL';
    }

    /**
     * Para onde mandar a pessoa logo depois do login.
     *
     * Todo mundo cai na home de notícias, qualquer que seja o perfil. O que
     * muda depois do login não é a tela de destino: é o MENU, que passa a
     * mostrar os atalhos do perfil de cada um.
     */
    rotaInicial(): string {
        return '/home';
    }

    /**
     * A tela de perfil de quem está logado.
     */
    rotaPerfil(): string | null {
        if (this.ehProfessor) { return '/professor'; }
        if (this.ehAluno || this.ehResponsavel) { return '/aluno'; }
        return null;   // administrador ainda não tem tela de perfil
    }

    /** Busca quem está logado: nome, perfil e dependentes. */
    buscarMe(): void {
        this.http.get<Me>(`${API}/auth/me`).subscribe({
            next: (me) => this.me.set(me),
            error: () => this.me.set(null)
        });
    }


    // FUNÇÕES INTERNAS

    private guardarSessao(resposta: RespostaLogin): void {

        const vencimento = Date.now() + resposta.expiresIn * 1000;

        this.token.set(resposta.accessToken);
        this.perfil.set(resposta.perfil);
        this.nome.set(resposta.nome);

        if (this.ehNavegador) {
            localStorage.setItem(CHAVE_TOKEN, resposta.accessToken);
            localStorage.setItem(CHAVE_PERFIL, resposta.perfil);
            localStorage.setItem(CHAVE_NOME, resposta.nome);
            localStorage.setItem(CHAVE_EXPIRA, String(vencimento));
        }
    }

    /** Lê a sessão salva, se ela existir e ainda valer. */
    private recuperarSessao(): void {
        if (!this.ehNavegador) {
            return;
        }

        const token = localStorage.getItem(CHAVE_TOKEN);
        const expira = Number(localStorage.getItem(CHAVE_EXPIRA));

        // Sem token, ou vencido: começa deslogado e limpa o lixo.
        if (!token || !expira || Date.now() >= expira) {
            this.sair();
            return;
        }

        this.token.set(token);
        this.perfil.set(localStorage.getItem(CHAVE_PERFIL) as Perfil);
        this.nome.set(localStorage.getItem(CHAVE_NOME) ?? '');
    }
}
