import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms'; import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterLink } from '@angular/router';

import { Administrador, dataLocal } from '../admin.model';

import { AdminService } from '../admin.service';

@Component({
    selector: 'app-admins-profile',
    imports: [ToastModule, ReactiveFormsModule, RouterLink],
    providers: [MessageService],
    templateUrl: './admins-profile.component.html',
    styleUrl: './admins-profile.component.scss'
})
export class AdminsProfileComponent {

    private readonly service = inject(AdminService);

    readonly perfil = this.service.perfil;

    private readonly fb = inject(FormBuilder);

    private readonly mensagens = inject(MessageService);


    readonly formulario = this.fb.nonNullable.group({
        telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]]
    });

    get telefone() {
        return this.formulario.controls.telefone;
    }

    protected sair(): void {
        this.mensagens.add({
            severity: 'info',
            summary: 'Sair da conta',
            detail: 'Ainda não ligado ao login.',
            life: 3000
        });
    }

    protected dataBr(data: Date | null): string {
        if (!data) { return '—'; }
        return data.toLocaleDateString('pt-BR');
    }

}