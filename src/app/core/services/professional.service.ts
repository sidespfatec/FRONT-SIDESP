import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Professional, ProfessionalSummary, Registered } from '../models/management.models';
@Injectable({ providedIn: 'root' })
export class ProfessionalService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/admin`;
  /** Lista administradores; o servidor exige acesso total. */
  administrators() {
    return this.http.get<ProfessionalSummary[]>(`${this.url}/administradores`);
  }
  /** Cadastra administrador com nível explícito. */
  createAdministrator(body: Professional) {
    return this.http.post<Registered>(`${this.url}/administradores`, body);
  }
  /** Lista professores sem dados de credenciais. */
  teachers() {
    return this.http.get<ProfessionalSummary[]>(`${this.url}/professores`);
  }
  /** Cadastra professor ativo e sem vínculo com turma. */
  createTeacher(body: Professional) {
    return this.http.post<Registered>(`${this.url}/professores`, body);
  }
  /** Inativa ou reativa um profissional sem excluir seu histórico. */
  status(domain: 'administradores' | 'professores', id: number, ativo: boolean) {
    return this.http.patch<void>(`${this.url}/${domain}/${id}/situacao`, { ativo });
  }
}
