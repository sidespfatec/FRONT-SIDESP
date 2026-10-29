import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProfessionalFormComponent } from '../component/professional-form/professional-form.component';
import { ProfessionalListComponent } from '../component/professional-list/professional-list.component';
import { NewModalityComponent } from '../features/admins/modalites/new-modality/new-modality.component';
import { provideRouter } from '@angular/router';

/** CPF calculado exclusivamente para os testes, sem usar cadastro de pessoa real. */
function cpf(): string {
  let value = '700000700';
  for (let size = 9; size < 11; size++) {
    let sum = 0;
    for (let i = 0; i < size; i++) sum += Number(value[i]) * (size + 1 - i);
    const digit = 11 - (sum % 11);
    value += digit >= 10 ? 0 : digit;
  }
  return value;
}

describe('Integração das telas administrativas', () => {
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  /** Preenche apenas dados fictícios usados pelo cadastro de profissional. */
  function fill(component: ProfessionalFormComponent): void {
    component.form.patchValue({
      nome: 'Professor de Teste',
      cpf: cpf(),
      nascimento: '1990-01-01',
      genero: 'M',
      email: 'professor@example.invalid',
      telefone: '12999999999',
      cep: '12500000',
      rua: 'Rua de Teste',
      numero: '1',
      bairro: 'Teste',
      cidade: 'Cidade',
      uf: 'sp',
      senha: 'abcdefgh',
      confirmacao: 'abcdefgh',
      registro: 'TESTE-01',
      especialidade: 'Esporte de teste',
    });
  }

  it('não envia cadastro incompleto', () => {
    const component = TestBed.createComponent(ProfessionalFormComponent).componentInstance;
    component.submit();
    http.expectNone('/api/v1/admin/professores');
    expect(component.error()).toContain('Confira');
  });

  it('envia professor com credenciais e endereço e não fecha o formulário em conflito', () => {
    const component = TestBed.createComponent(ProfessionalFormComponent).componentInstance;
    fill(component);
    let saved = false;
    component.saved.subscribe(() => (saved = true));
    component.submit();
    component.submit();
    const request = http.expectOne('/api/v1/admin/professores');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.cadastro.credenciais.cpfLogin).toBe(cpf());
    expect(request.request.body.cadastro.endereco.uf).toBe('SP');
    expect(request.request.body.registro).toBe('TESTE-01');
    expect(request.request.body.nivel).toBeUndefined();
    request.flush(
      { mensagem: 'Cadastro duplicado', errosCampos: { cpf: 'CPF já cadastrado.' } },
      { status: 409, statusText: 'Conflict' },
    );
    expect(saved).toBe(false);
    expect(component.busy()).toBe(false);
    expect(component.error()).toContain('CPF já cadastrado');
    expect(component.form.controls.nome.value).toBe('Professor de Teste');
  });

  it('só confirma administrador após resposta da API com o nível escolhido', () => {
    const component = TestBed.createComponent(ProfessionalFormComponent).componentInstance;
    fill(component);
    component.administrator = true;
    component.form.patchValue({ nivel: 'ADMINISTRADOR_TOTAL' });
    let count = 0;
    component.saved.subscribe(() => count++);
    component.submit();
    const request = http.expectOne('/api/v1/admin/administradores');
    expect(request.request.body.nivel).toBe('ADMINISTRADOR_TOTAL');
    expect(count).toBe(0);
    request.flush({ id: 123, mensagem: 'Cadastro realizado.' });
    expect(count).toBe(1);
    expect(component.form.controls.senha.value).toBe('');
  });

  it('não apresenta professores de exemplo quando o banco está vazio', () => {
    const component = TestBed.createComponent(ProfessionalListComponent).componentInstance;
    component.ngOnInit();
    http.expectOne('/api/v1/admin/professores').flush([]);
    expect(component.rows()).toEqual([]);
    expect(component.filtered).toEqual([]);
  });

  it('preserva a situação da lista quando a API recusa a inativação', () => {
    const component = TestBed.createComponent(ProfessionalListComponent).componentInstance;
    component.administrator = true;
    const row = {
      id: 123,
      nome: 'Administrador de teste',
      perfil: 'ADMINISTRADOR_TOTAL',
      ativo: true,
    };
    component.rows.set([row]);
    component.toggle(row);
    const request = http.expectOne('/api/v1/admin/administradores/123/situacao');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ ativo: false });
    request.flush(
      { mensagem: 'Não é possível inativar a própria conta.' },
      { status: 400, statusText: 'Bad Request' },
    );
    expect(component.rows()[0].ativo).toBe(true);
    expect(component.error()).toContain('própria conta');
  });

  it('reconsulta a lista depois de alterar situação com sucesso', () => {
    const component = TestBed.createComponent(ProfessionalListComponent).componentInstance;
    component.toggle({ id: 123, nome: 'Professor', perfil: 'PROFESSOR', ativo: true });
    http.expectOne('/api/v1/admin/professores/123/situacao').flush(null);
    http
      .expectOne('/api/v1/admin/professores')
      .flush([{ id: 123, nome: 'Professor', perfil: 'PROFESSOR', ativo: false }]);
    expect(component.rows()[0].ativo).toBe(false);
  });

  it('carrega somente polos ativos para o cadastro de modalidade', () => {
    const component = TestBed.createComponent(NewModalityComponent).componentInstance;
    component.ngOnInit();
    http
      .expectOne(
        (request) =>
          request.url === '/api/v1/admin/polos' && request.params.get('ativo') === 'true',
      )
      .flush([]);
    expect(component.hubs()).toEqual([]);
    expect(component.loading()).toBe(false);
  });
});
