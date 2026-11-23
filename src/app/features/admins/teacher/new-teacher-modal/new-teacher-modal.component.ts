import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputMaskModule } from 'primeng/inputmask';
import { MaskCaretDirective } from '../../../../directives/mask-caret.directive';

@Component({
    selector: 'app-new-teacher-modal',
    imports: [DialogModule, InputTextModule, InputMaskModule, SelectModule, FileUploadModule, ButtonModule, FormsModule, MaskCaretDirective, MultiSelectModule, SelectButtonModule],
    templateUrl: './new-teacher-modal.component.html',
    styleUrl: './new-teacher-modal.component.scss'
})

export class NewTeacherModalComponent {
    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    selectedModalities: string[] = [];
    shirtSize: string | null = null;
    contractType: 'contratado' | 'concursado' = 'contratado';

    generos = [
        { label: 'Feminino', value: 'F' },
        { label: 'Masculino', value: 'M' }
    ];

    ufs = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
        'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    shirtSizes = [
        { label: 'PP', value: 'PP' },
        { label: 'P', value: 'P' },
        { label: 'M', value: 'M' },
        { label: 'G', value: 'G' },
        { label: 'GG', value: 'GG' },
        { label: 'XG', value: 'XG' }
    ];

    contractTypes = [
        { label: 'Contratado', value: 'contratado' },
        { label: 'Concursado', value: 'concursado' }
    ];

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