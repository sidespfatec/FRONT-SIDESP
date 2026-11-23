import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { PerfilDaConta, PerfilParaSalvar, TrocaDeSenha } from './perfil.model';

const API = '/api/v1';

/** Conta de quem está logado. Serve o perfil do admin e o do professor. */
@Injectable({ providedIn: 'root' })
export class PerfilService {

    private readonly _perfil = signal<PerfilDaConta | null>(null);

    readonly perfil = this._perfil.asReadonly();
    readonly carregando = signal(false);
    readonly erro = signal<string | null>(null);

    //o back guarda listas; as telas mostram um só
    readonly telefone = computed(() => this._perfil()?.telefones[0] ?? '');
    readonly endereco = computed(() => this._perfil()?.enderecos[0] ?? null);

    constructor(private http: HttpClient) { }

    buscarPerfil(): void {
        this.carregando.set(true);
        this.erro.set(null);

        this.http.get<PerfilDaConta>(`${API}/perfil`).subscribe({
            next: (dados) => {
                this._perfil.set(dados);
                this.carregando.set(false);
            },
            error: (falha: HttpErrorResponse) => {
                this.erro.set(this.explicarErro(falha));
                this.carregando.set(false);
            }
        });
    }

    /** O PUT exige o perfil inteiro, então junta o que já está na tela com o telefone novo. */
    salvarTelefone(telefone: string): Observable<void> {
        return this.salvar({ ...this.corpoAtual(), telefone });
    }

    salvar(dados: PerfilParaSalvar): Observable<void> {
        return this.http.put<void>(`${API}/perfil`, dados).pipe(
            tap(() => this.buscarPerfil())
        );
    }

    trocarSenha(troca: TrocaDeSenha): Observable<void> {
        return this.http.post<void>(`${API}/perfil/senha`, troca);
    }

    private corpoAtual(): PerfilParaSalvar {
        const atual = this._perfil();
        const endereco = this.endereco();

        if (!atual || !endereco) {
            throw new Error('Perfil ainda não carregado.');
        }

        return {
            nome: atual.nome,
            nomeSocial: atual.nomeSocial ?? '',
            email: atual.email,
            telefone: this.telefone(),
            endereco
        };
    }

    explicarErro(falha: HttpErrorResponse): string {
        if (falha.status === 0) { return 'Sem conexão com o servidor.'; }
        if (falha.status === 401) { return 'Sua sessão expirou. Entre novamente.'; }
        if (falha.status === 429) { return 'Muitas tentativas. Espere um pouco.'; }
        return falha.error?.mensagem ?? 'Não foi possível carregar o perfil.';
    }
}
