import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ManageTeachersComponent } from '../features/admins/teacher/manage-teachers/manage.teachers.component';
import { ManageAdminComponent } from '../features/admins/manage-admin/manage-admin.component';
import { RegistrationComponent } from '../features/public/pages/registration/registration.component';

describe('Layout da main com dados da API', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('renderiza professor real na estrutura da main e abre seu formulário original', async () => {
    const fixture = TestBed.createComponent(ManageTeachersComponent);
    fixture.detectChanges();
    http.expectOne('/api/v1/admin/professores').flush([{id: 15, nome: 'Professor cadastrado', perfil: 'PROFESSOR', especialidade: 'Esporte cadastrado', ativo: true}]);
    http.expectOne('/api/v1/admin/modalidades?ativo=true').flush([]);
    fixture.detectChanges();
    const row = fixture.nativeElement.querySelector('.teacher-list .teacher-item');
    expect(row.textContent).toContain('Professor cadastrado');
    expect(row.textContent).toContain('Esporte cadastrado');
    expect(fixture.nativeElement.querySelector('app-professional-list')).toBeNull();
    fixture.nativeElement.querySelector('[aria-label="Novo professor"]').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.querySelector('.teacher-dialog .teacher-form')).not.toBeNull();
  });

  it('mantém a lista vazia quando a API não retorna professores', () => {
    const fixture = TestBed.createComponent(ManageTeachersComponent);
    fixture.detectChanges();
    http.expectOne('/api/v1/admin/professores').flush([]);
    http.expectOne('/api/v1/admin/modalidades?ativo=true').flush([]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.teacher-item').length).toBe(0);
  });

  it('renderiza administradores com o cartão da main sem inventar CPF', () => {
    const fixture = TestBed.createComponent(ManageAdminComponent);
    fixture.detectChanges();
    http.expectOne('/api/v1/admin/administradores').flush([{id: 21, nome: 'Administrador cadastrado', perfil: 'ADMINISTRADOR_PARCIAL', ativo: true}]);
    fixture.detectChanges();
    const row = fixture.nativeElement.querySelector('.admin-list .admin-item');
    expect(row.textContent).toContain('Administrador cadastrado');
    expect(row.textContent).toContain('CPF protegido');
  });

  it('preserva os campos e ícones do cadastro da main sem avançar com dados inválidos', () => {
    const fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.registration-card .register-header')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.input-wrap .pi-user')).not.toBeNull();
    const next = Array.from(fixture.nativeElement.querySelectorAll('button')).find((button: any) => button.textContent.includes('Próximo')) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeStep).toBe(1);
    expect(fixture.componentInstance.error()).toContain('Confira os campos');
  });
});
