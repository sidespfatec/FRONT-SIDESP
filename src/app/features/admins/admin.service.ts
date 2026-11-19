import { Injectable, signal } from '@angular/core';

import { Administrador, Perfil_provisorio } from './admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {

    private readonly _perfil = signal<Administrador>(Perfil_provisorio);


    readonly perfil = this._perfil.asReadonly();

    constructor() {

    }

}
