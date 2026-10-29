import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Modality, ModalityInput } from '../models/management.models';
@Injectable({ providedIn: 'root' })
export class ModalityService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/admin/modalidades`;
  /** Busca modalidades e elimina polos inativos quando o filtro é ativo=true. */
  list(ativo?: boolean) {
    const params = ativo === undefined ? new HttpParams() : new HttpParams().set('ativo', ativo);
    return this.http.get<Modality[]>(this.url, { params });
  }
  /** Cadastra modalidade com idade e limite mensal de faltas. */
  create(body: ModalityInput) {
    return this.http.post<{ id: number }>(this.url, body);
  }
  /** Inativa ou reativa a modalidade. */
  status(id: number, ativo: boolean) {
    return this.http.patch<void>(`${this.url}/${id}/situacao`, { ativo });
  }
}
