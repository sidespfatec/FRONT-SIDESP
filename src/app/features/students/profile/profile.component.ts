// Mesma tela para ALUNO e RESPONSAVEL: o /auth/me devolve 'dependentes'
// para os dois, cheio ou vazio, e a tela mostra o que vier.
// Por enquanto é só a casca -- matrículas e frequência ainda não têm endpoint.

import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';
import { Dependente } from '../../../core/auth/auth.model';

@Component({
    selector: 'app-student-profile',
    imports: [],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class StudentProfileComponent implements OnInit {

    constructor(private auth: AuthService) { }

    ngOnInit(): void {
        // O login já trouxe nome e perfil; esta chamada traz os dependentes.
        this.auth.buscarMe();
    }

    /** O nome vem do login, então aparece antes mesmo do /auth/me responder. */
    get nome(): string {
        return this.auth.nome();
    }

    get ehResponsavel(): boolean {
        return this.auth.ehResponsavel;
    }

    get dependentes(): Dependente[] {
        // ?? [] evita que a tela quebre enquanto a resposta não chegou.
        return this.auth.me()?.dependentes ?? [];
    }

    /** Verdadeiro enquanto o /auth/me ainda não respondeu. */
    get carregando(): boolean {
        return this.auth.me() === null;
    }
}
