import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { AdministradorCriado, AdministradorDaLista, NovoAdministrador } from './admin-management.model';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class AdminManagementService {

    administradores = signal<AdministradorDaLista[]>([]);
    carregando = signal(false);
    erro = signal<string | null>(null);

    constructor(private http: HttpClient) { }

    buscarAdministradores(): void {
        this.carregando.set(true);
        this.erro.set(null);

        this.http.get<AdministradorDaLista[]>(`${API}/admin/administradores`).subscribe({
            next: (lista) => {
                this.administradores.set(lista);
                this.carregando.set(false);
            },
            error: (falha: HttpErrorResponse) => {
                this.erro.set(this.explicarErro(falha));
                this.carregando.set(false);
            }
        });
    }

    /** Devolve o Observable: quem decide o que fazer depois é a tela. */
    cadastrarAdministrador(novo: NovoAdministrador): Observable<AdministradorCriado> {
        return this.http.post<AdministradorCriado>(`${API}/admin/administradores`, novo);
    }

    /** Ativa ou inativa; o registro nunca é apagado. */
    alterarSituacao(id: number, ativo: boolean): Observable<void> {
        return this.http.patch<void>(`${API}/admin/administradores/${id}/situacao`, { ativo });
    }

    explicarErro(falha: HttpErrorResponse): string {
        if (falha.status === 0) { return 'Sem conexão com o servidor.'; }
        if (falha.status === 401) { return 'Sua sessão expirou. Entre novamente.'; }
        if (falha.status === 403) { return 'Só administrador total pode cadastrar administradores.'; }
        if (falha.status === 409) { return 'Já existe cadastro com este CPF ou e-mail.'; }
        return falha.error?.mensagem ?? 'Não foi possível cadastrar. Confira os dados.';
    }
}
