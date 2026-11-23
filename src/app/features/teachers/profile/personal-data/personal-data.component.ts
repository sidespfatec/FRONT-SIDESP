import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { PerfilProfessor, dataLocal } from '../../teacher.model';
import { TeacherService } from '../../teacher.service';

/**
 * Aba "Dados": cadastro do professor.
 *
 * Regra de edicao adotada: ele altera o proprio telefone, e so isso.
 * Nome, CPF, nascimento, sexo, especialidade e registro profissional sao
 * mantidos pela administracao -- registro profissional e credencial, nao preferencia.
 */
@Component({
    selector: 'app-personal-data',
    imports: [ReactiveFormsModule, ButtonModule, InputMaskModule, ToastModule],
    providers: [MessageService],
    templateUrl: './personal-data.component.html',
    styleUrl: './personal-data.component.scss'
})
export class PersonalDataComponent {

    readonly perfil = input.required<PerfilProfessor>();

    private readonly fb = inject(FormBuilder);
    private readonly service = inject(TeacherService);
    private readonly mensagens = inject(MessageService);

    /** Controla se a secao Contato esta em modo leitura ou em modo formulario. */
    readonly editando = signal(false);

    readonly salvando = signal(false);

    // nonNullable evita que o controle volte null depois de um reset.
    readonly formulario = this.fb.nonNullable.group({
        telefone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]]
    });

    get telefone() {
        return this.formulario.controls.telefone;
    }

    abrirEdicao(): void {
        // Carrega o valor atual antes de mostrar o formulario.
        this.formulario.setValue({ telefone: this.perfil().telefone });
        this.editando.set(true);
    }

    cancelar(): void {
        this.editando.set(false);
    }

    salvar(): void {
        if (this.formulario.invalid) {
            // markAllAsTouched faz as mensagens de erro aparecerem mesmo nos
            // campos que o usuario nunca tocou.
            this.formulario.markAllAsTouched();
            return;
        }

        this.salvando.set(true);

        this.service.atualizarTelefone(this.formulario.getRawValue().telefone).subscribe({
            next: () => {
                this.salvando.set(false);
                this.editando.set(false);
                this.mensagens.add({
                    severity: 'success',
                    summary: 'Dados atualizados',
                    detail: 'Seu telefone foi alterado.'
                });
            },
            error: () => {
                this.salvando.set(false);
                this.mensagens.add({
                    severity: 'error',
                    summary: 'Não foi possível salvar',
                    detail: 'Tente de novo em instantes.'
                });
            }
        });
    }

    /** '1988-07-04' vira '04/07/1988'. */
    protected dataBr(iso: string): string {
        const d = dataLocal(iso);
        return d.toLocaleDateString('pt-BR');
    }

    protected sexoPorExtenso(sexo: string): string {
        return sexo === 'F' ? 'Feminino' : 'Masculino';
    }
}
