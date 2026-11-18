import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TurmaDoProfessor, rotuloDias } from '../teacher.model';
import { TeacherService } from '../teacher.service';
import { AttendanceComponent } from './attendance/attendance.component';
import { ClassStudentsComponent } from './class-students/class-students.component';
import { ClassLogComponent } from './class-log/class-log.component';

@Component({
    selector: 'app-class',
    // Tudo que o template usa tem que estar aqui: a diretiva routerLink
    // e os três componentes filhos.
    imports: [RouterLink, AttendanceComponent, ClassStudentsComponent, ClassLogComponent],
    templateUrl: './class.component.html',
    styleUrl: './class.component.scss'
})
export class ClassComponent implements OnInit {

    /** Id que veio no endereço: /professor/turmas/3 -> 3 */
    turmaId = 0;

    rotuloDias = rotuloDias;

    constructor(
        private rota: ActivatedRoute,
        private service: TeacherService
    ) { }

    ngOnInit(): void {
        // paramMap guarda os pedaços variáveis do endereço — o ':id' da rota.
        // Vem sempre como TEXTO ('3'), por isso o Number(...).
        this.turmaId = Number(this.rota.snapshot.paramMap.get('id'));

        // Busca uma vez aqui; as três abas leem do mesmo service.
        this.service.buscarTurmas();
        this.service.buscarAulas(this.turmaId);
        this.service.buscarAlunos(this.turmaId);
        this.service.buscarRegistros(this.turmaId);
    }

    get turma(): TurmaDoProfessor | undefined {
        return this.service.turmas().find(t => t.id === this.turmaId);
    }

    get alunos() { return this.service.alunos(); }
    get carregando() { return this.service.carregando(); }
    get erro() { return this.service.erro(); }
}