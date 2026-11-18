import { Component, OnInit } from '@angular/core';

import { TeacherService } from '../teacher.service';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { ScheduleComponent } from './schedule/schedule.component';

@Component({
    selector: 'app-profile',
    // Em componente standalone o template só enxerga o que está aqui.
    imports: [PersonalDataComponent, ScheduleComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

    constructor(private service: TeacherService) { }

    // ngOnInit roda uma vez, quando a tela abre. É aqui que se pede o dado 
    ngOnInit(): void {
        this.service.buscarPerfil();
        this.service.buscarTurmas();   // a agenda precisa delas
    }

    get perfil() { return this.service.perfil(); }
    get carregando() { return this.service.carregando(); }
    get erro() { return this.service.erro(); }
}