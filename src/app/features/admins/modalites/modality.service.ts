import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';

import { ModalidadeDaLista } from './modality.model';

const API = '/api/v1';

@Injectable({ providedIn: 'root' })
export class ModalityService {

    modalidades = signal<ModalidadeDaLista[]>([]);
    carregando = signal(false);
    erro = signal<string | null>(null);

    //formato que os selects da tela esperam
    readonly opcoes = computed(() =>
        this.modalidades().map(m => ({ label: m.nome, value: m.nome }))
    );

    constructor(private http: HttpClient) { }

    buscarModalidades(apenasAtivas = true): void {
        this.carregando.set(true);
        this.erro.set(null);

        this.http.get<ModalidadeDaLista[]>(`${API}/admin/modalidades`, {
            params: apenasAtivas ? { ativo: true } : {}
        }).subscribe({
            next: (lista) => {
                this.modalidades.set(lista);
                this.carregando.set(false);
            },
            error: (falha: HttpErrorResponse) => {
                this.erro.set(this.explicarErro(falha));
                this.carregando.set(false);
            }
        });
    }

    explicarErro(falha: HttpErrorResponse): string {
        if (falha.status === 0) { return 'Sem conexão com o servidor.'; }
        if (falha.status === 401) { return 'Sua sessão expirou. Entre novamente.'; }
        return falha.error?.mensagem ?? 'Não foi possível carregar as modalidades.';
    }
}
