// Guard é o porteiro: o Angular pergunta a ele antes de abrir a rota.

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';
import { Perfil } from './auth.model';

export function permitirPerfis(...perfis: Perfil[]): CanActivateFn {

    return () => {
        const auth = inject(AuthService);
        const router = inject(Router);

        // Não logado -> manda para o login.
        if (!auth.estaLogado) {
            // createUrlTree devolve "vá para lá" em vez de só 'false'.
            // Com 'false' puro a navegação morre e a pessoa fica na tela
            // anterior sem entender o que aconteceu.
            return router.createUrlTree(['/login']);
        }

        // Logado, mas perfil errado -> manda para a home.
        const perfilAtual = auth.perfil();
        if (!perfilAtual || !perfis.includes(perfilAtual)) {
            return router.createUrlTree(['/home']);
        }

        return true;
    };
}

/** Atalhos, para a tabela de rotas ficar legível. */
export const somenteProfessor = permitirPerfis('PROFESSOR');

export const somenteAdministrador = permitirPerfis(
    'ADMINISTRADOR_TOTAL',
    'ADMINISTRADOR_PARCIAL'
);

/** Telas que tanto o admin quanto o professor podem ver. */
export const administradorOuProfessor = permitirPerfis(
    'ADMINISTRADOR_TOTAL',
    'ADMINISTRADOR_PARCIAL',
    'PROFESSOR'
);

/** A área do aluno: ele e quem responde por ele. */
export const alunoOuResponsavel = permitirPerfis('ALUNO', 'RESPONSAVEL');
