import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-new-teacher-modal',
    standalone: true,
    imports: [
        CommonModule, DialogModule,
        InputTextModule, SelectModule, FileUploadModule, ButtonModule
    ],
    templateUrl: './new-teacher-modal.component.html',
    styleUrl: './new-teacher-modal.component.scss'
})
export class NewTeacherModalComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    modalities = [
        { label: 'Educação física', value: 'educacao-fisica' },
        { label: 'Natação', value: 'natacao' },
        { label: 'Vôlei', value: 'volei' },
        { label: 'Futebol', value: 'futebol' }
    ];

    classGroups = [
        { label: 'Turma A - Manhã', value: 'turma-a' },
        { label: 'Turma B - Tarde', value: 'turma-b' },
        { label: 'Turma C - Noite', value: 'turma-c' }
    ];

    onCancel(): void {
        this.visible = false;
        this.visibleChange.emit(false);
    }
}