import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Child, Medical, Registered } from '../models/management.models';
@Injectable({ providedIn: 'root' })
export class GuardianService {
  private http = inject(HttpClient);
  /** Cadastra dependente do titular autenticado, sem escolher outra conta. */
  create(body: Child) {
    return this.http.post<Registered>(`${environment.apiUrl}/responsavel/dependentes`, body);
  }
  /** Consulta anamnese; o servidor confere perfil e vínculo com o aluno. */
  medical(id: number) {
    return this.http.get<Medical>(`${environment.apiUrl}/fichas-medicas/${id}`);
  }
}
