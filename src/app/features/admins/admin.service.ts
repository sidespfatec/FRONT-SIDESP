import { computed, inject, Injectable } from '@angular/core';

import { Administrador, dataLocal } from './admin.model';
import { PerfilService } from '../../core/perfil/perfil.service';

@Injectable({ providedIn: 'root' })
export class AdminService {

    private readonly conta = inject(PerfilService);

    readonly carregando = this.conta.carregando;
    readonly erro = this.conta.erro;

    //monta a ficha com o que o GET /perfil devolve; o resto o endpoint não traz
    readonly perfil = computed<Administrador | null>(() => {
        const dados = this.conta.perfil();
        if (!dados) { return null; }

        return {
            id: 0,
            nome: dados.nome,
            cpf: '',
            rg: '',
            nascimento: dados.dataNascimento ? dataLocal(dados.dataNascimento) : null,
            email: dados.email,
            telefone: this.conta.telefone(),
            cidade: this.conta.endereco()?.cidade ?? '',
            nivel: dados.perfil === 'ADMINISTRADOR_TOTAL' ? 'Acesso total' : 'Acesso parcial',
            cargo: '',
            unidade: '',
            admissao: null,
            doisFatores: false,
            ativo: true
        };
    });

    buscarPerfil(): void {
        this.conta.buscarPerfil();
    }
}
