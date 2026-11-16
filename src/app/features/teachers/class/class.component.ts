import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

import { TurmaDoProfessor, rotuloDias } from '../teacher.model';
import { TeacherService } from '../teacher.service';
import { AttendanceComponent } from './attendance/attendance.component';
import { ClassLogComponent } from './class-log/class-log.component';
import { ClassStudentsComponent } from './class-students/class-students.component';

/**
 * Tela da turma pelo olhar do professor: cabecalho + tres abas.
 *
 * Igual ao perfil, esta casca nao guarda estado proprio. Ela so descobre
 * QUAL turma esta aberta e passa o id para os filhos.
 */
@Component({
    selector: 'app-class',
    imports: [RouterLink, TabsModule, AttendanceComponent, ClassStudentsComponent, ClassLogComponent],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss'
})
export class ClassComponent {

    private readonly rota = inject(ActivatedRoute);
    private readonly service = inject(TeacherService);

    readonly turma = signal<TurmaDoProfessor | undefined>(undefined);

    // Expoe a funcao do model para o template, que so enxerga membros da classe.
    protected readonly rotuloDias = rotuloDias;

    constructor() {
        // snapshot basta porque sair de uma turma e entrar em outra recria o componente.
        // Se um dia a navegacao for entre ids sem recriar, trocar por paramMap.subscribe.
        const id = Number(this.rota.snapshot.paramMap.get('id'));
        this.turma.set(this.service.turmaPorId(id));
    }
}
