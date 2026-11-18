// Interceptor é um "pedágio": TODA requisição do HttpClient passa por aqui
// antes de sair. É onde penduramos o token.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const autenticacaoInterceptor: HttpInterceptorFn = (requisicao, proximo) => {

    const auth = inject(AuthService);
    const token = auth.token();

    // Sem token (tela de login, por exemplo): segue sem mexer em nada.
    if (!token) {
        return proximo(requisicao);
    }

    const comToken = requisicao.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    });

    return proximo(comToken);
};
