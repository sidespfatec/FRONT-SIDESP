import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TurmaDoProfessor, rotuloDias } from '../../teacher.model';

/**
 * Aba "Minhas turmas": so desenha o que recebe de cima.
 *
 * Nao tem estado proprio nem service injetado. Componente burro de proposito:
 * quem busca dado e o perfil, quem mostra e este. Assim da para reaproveitar
 * esta lista em outra tela (um painel de administrador, por exemplo) sem mudar nada.
 */
@Component({
    selector: 'app-my-classes',
    imports: [RouterLink],
    templateUrl: './my-classes.component.html',
    styleUrl: './my-classes.component.scss'
})
export class MyClassesComponent {

    // input.required e a forma nova do @Input(). Ja devolve um signal,
    // por isso no template chamamos turmas() com parenteses.
    readonly turmas = input.required<TurmaDoProfessor[]>();

    // O template do Angular so enxerga membros da classe, nao funcoes importadas.
    // Esta linha expoe a funcao do model para poder usar {{ rotuloDias(...) }} no HTML.
    protected readonly rotuloDias = rotuloDias;
}
