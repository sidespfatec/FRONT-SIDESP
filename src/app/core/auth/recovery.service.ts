import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API = '/api/v1';

/** Resposta do pedido de código: mensagem neutra, igual exista a conta ou não. */
export interface RespostaRecuperacao {
    mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class RecoveryService {

    constructor(private http: HttpClient) { }

    /** Pede o código. O back responde 202 e manda o e-mail por fora da requisição. */
    solicitarCodigo(identificador: string): Observable<RespostaRecuperacao> {
        return this.http.post<RespostaRecuperacao>(`${API}/auth/recuperar-senha`, { identificador });
    }

    /** Troca a senha. O back responde 204, sem corpo. */
    redefinirSenha(token: string, novaSenha: string, confirmacaoSenha: string): Observable<void> {
        return this.http.post<void>(`${API}/auth/redefinir-senha`, {
            token,
            novaSenha,
            confirmacaoSenha
        });
    }
}
