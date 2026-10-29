import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Hub, HubInput } from '../models/management.models';
@Injectable({ providedIn: 'root' })
export class HubService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/admin/polos`;
  /** Busca polos por nome e situação; ativo=true devolve opções de cadastro. */
  list(busca = '', ativo?: boolean) {
    let params = new HttpParams().set('busca', busca);
    if (ativo !== undefined) params = params.set('ativo', ativo);
    return this.http.get<Hub[]>(this.url, { params });
  }
  /** Cadastra endereço e coordenadas na mesma operação. */
  create(body: HubInput) {
    return this.http.post<{ id: number }>(this.url, body);
  }
  /** Altera situação preservando os vínculos existentes. */
  status(id: number, ativo: boolean) {
    return this.http.patch<void>(`${this.url}/${id}/situacao`, { ativo });
  }
}
