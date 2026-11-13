import { ChangeDetectorRef, Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ProfessionalFormComponent } from '../../../../component/professional-form/professional-form.component';
import { ProfessionalSummary } from '../../../../core/models/management.models';
import { ModalityService } from '../../modalites/services/modality.service';
@Component({
  selector: 'app-new-teacher-modal', standalone: true,
  imports: [ReactiveFormsModule, FormsModule, DialogModule, InputTextModule, SelectModule, FileUploadModule, ButtonModule],
  templateUrl: './new-teacher-modal.component.html', styleUrl: './new-teacher-modal.component.scss'
})
export class NewTeacherModalComponent extends ProfessionalFormComponent {
  readonly genderOptions = [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }];
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() teacher: ProfessionalSummary | null = null;
  private changeDetector = inject(ChangeDetectorRef);
  private modalitiesApi = inject(ModalityService);
  modalities: { label: string; value: string }[] = [];
  classGroups: { label: string; value: string }[] = [];
  ngOnInit() {
    this.saved.subscribe(() => this.onCancel());
    this.modalitiesApi.list(true).subscribe({
      next: rows => { this.modalities = rows.map(m => ({ label: m.nome, value: m.nome })); this.changeDetector.markForCheck(); },
      error: () => this.error.set('Não foi possível carregar as modalidades.')
    });
  }
  ngOnChanges() {
    this.form.reset({ nivel: 'ADMINISTRADOR_PARCIAL' });
    this.error.set('');
    if (this.teacher) this.form.patchValue({ nome: this.teacher.nome, especialidade: this.teacher.especialidade || '', registro: this.teacher.registro || '' });
  }
  onCancel() { this.visible = false; this.visibleChange.emit(false); }
}
