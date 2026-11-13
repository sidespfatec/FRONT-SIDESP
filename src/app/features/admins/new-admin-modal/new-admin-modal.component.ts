import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { PasswordModule } from 'primeng/password';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Administrador, ModoFicha } from '../admin.model';
import { ProfessionalFormComponent } from '../../../component/professional-form/professional-form.component';
@Component({
 selector: 'app-new-admin-modal', standalone: true,
 imports: [FormsModule, ReactiveFormsModule, DialogModule, InputTextModule, InputMaskModule, DatePickerModule, SelectModule, PasswordModule, ToggleSwitchModule, TagModule, ButtonModule],
 templateUrl: './new-admin-modal.component.html', styleUrl: './new-admin-modal.component.scss'
})
export class NewAdminModalComponent extends ProfessionalFormComponent {
 readonly genderOptions = [{label:'Masculino', value:'M'}, {label:'Feminino', value:'F'}];
 @Input() visible = false;
 @Input() modo: ModoFicha = 'ver';
 @Input() admin: Administrador | null = null;
 @Output() visibleChange = new EventEmitter<boolean>();
 @Output() editar = new EventEmitter<void>();
 @Output() desativar = new EventEmitter<void>();
 @Output() redefinirSenha = new EventEmitter<void>();
 readonly niveis = [{label: 'Administrador geral', value: 'ADMINISTRADOR_TOTAL'}, {label: 'Administrador de unidade', value: 'ADMINISTRADOR_PARCIAL'}];
 readonly hoje = new Date();
 readonly addressFields = [{key:'cep',label:'CEP'},{key:'rua',label:'Rua'},{key:'numero',label:'Número'},{key:'bairro',label:'Bairro'},{key:'uf',label:'UF'}];
 nascimento: Date | null = null;
 admissao: Date | null = null;
 ngOnChanges() {
   this.administrator = true;
   this.form.reset({nivel: 'ADMINISTRADOR_PARCIAL'});
   this.nascimento = null;
   this.admissao = null;
   this.error.set('');
 }
 date(value: Date | null, field: 'nascimento' | 'admissao') {
   const iso = value ? [value.getFullYear(), String(value.getMonth()+1).padStart(2,'0'), String(value.getDate()).padStart(2,'0')].join('-') : '';
   this.form.controls[field].setValue(iso);
 }
 get readOnly() { return this.modo === 'ver'; }
 get titulo() { return this.modo === 'novo' ? 'Novo administrador' : this.admin?.nome || 'Administrador'; }
 get secoes() {
   const a = this.admin;
   if (!a) return [];
   return [
     {titulo: 'Dados pessoais', itens: [{rotulo:'CPF', valor:'Protegido'}, {rotulo:'RG', valor:a.rg}, {rotulo:'Nascimento', valor:a.nascimento?.toLocaleDateString('pt-BR')}]},
     {titulo: 'Contato', itens:[{rotulo:'E-mail', valor:a.email}, {rotulo:'Telefone', valor:a.telefone}, {rotulo:'Cidade', valor:a.cidade}]},
     {titulo:'Acesso', itens:[{rotulo:'Nível de permissão', valor:a.nivel}, {rotulo:'Cargo', valor:a.cargo}, {rotulo:'Unidade', valor:a.unidade}, {rotulo:'Admissão', valor:a.admissao?.toLocaleDateString('pt-BR')}, {rotulo:'Dois fatores', valor:'Não disponível'}, {rotulo:'Cadastrado por', valor:a.cadastradoPor}]}
   ];
 }
 invalido(field: string) { const c = this.form.get(field); return !!c && c.invalid && c.touched; }
 enviar() { this.submit(); }
 cancelar() { this.fechar(); }
 fechar() { this.visible = false; this.visibleChange.emit(false); }
}
