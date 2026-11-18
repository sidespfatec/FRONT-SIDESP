import { Component, Input } from '@angular/core';

import { PerfilProfessor } from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

@Component({
    selector: 'app-personal-data',
    imports: [],
    templateUrl: './personal-data.component.html',
    styleUrl: './personal-data.component.scss'
})
export class PersonalDataComponent {

    // @Input = o dado vem do componente PAI (o perfil), pelo HTML:
    //     <app-personal-data [perfil]="perfil" />
    // O '!' promete ao TypeScript que o pai sempre manda.
    @Input() perfil!: PerfilProfessor;

    /** false = mostrando; true = editando. Propriedade comum: só muda em clique. */
    editando = false;

    /** O que está sendo digitado. Só vai pro service quando ele salva. */
    rascunho = '';

    constructor(private service: TeacherService) { }

    abrirEdicao(): void {
        // Leva o valor atual pro campo, senão ele abre vazio
        this.rascunho = this.perfil.telefone;
        this.editando = true;
    }

    cancelar(): void {
        // Não precisa desfazer nada: o rascunho nunca encostou no perfil
        this.editando = false;
    }

    salvar(): void {
        // Validação simples: (12) 99999-9999
        if (!this.telefoneValido) {
            return;
        }

        this.service.atualizarTelefone(this.rascunho);
        this.editando = false;
    }

    get telefoneValido(): boolean {
        // Isto é uma expressão regular: o desenho de um formato.
        //   \( \)  = os parênteses literais     \d{2} = dois dígitos
        //   ^ $    = começo e fim do texto, pra não aceitar lixo em volta
        return /^\(\d{2}\) \d{5}-\d{4}$/.test(this.rascunho);
    }

    /** '1988-07-04' -> '04/07/1988' */
    get nascimento(): string {
        return this.perfil.dataNascimento.split('-').reverse().join('/');
    }
}