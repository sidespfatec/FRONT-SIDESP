import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ProfessionalFormComponent } from '../../../component/professional-form/professional-form.component';
@Component({
  selector: 'app-new-admin-modal',
  standalone: true,
  imports: [DialogModule, ProfessionalFormComponent],
  templateUrl: './new-admin-modal.component.html',
})
export class NewAdminModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() saved = new EventEmitter<void>();
  /** Fecha o diálogo apenas quando o cadastro foi confirmado ou cancelado. */
  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
  /** Atualiza a listagem que abriu o formulário. */
  complete(): void {
    this.saved.emit();
    this.close();
  }
}
