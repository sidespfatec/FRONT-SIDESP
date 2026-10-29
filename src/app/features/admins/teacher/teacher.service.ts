import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CadastroResultado, Teacher, TeacherPayload } from './teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherService {

    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/professores`;

    cadastrar(payload: TeacherPayload): Observable<CadastroResultado> {
        return this.http.post<CadastroResultado>(this.url, payload);
    }

    listar(): Observable<Teacher[]> {
        return this.http.get<Teacher[]>(this.url);
    }

    atualizar(id: number, payload: TeacherPayload): Observable<Teacher> {
        return this.http.put<Teacher>(`${this.url}/${id}`, payload);
    }

    alterarSituacao(id: number, ativo: boolean): Observable<Teacher> {
        return this.http.patch<Teacher>(`${this.url}/${id}/situacao`, { ativo });
    }

    endpointAusente(falha: HttpErrorResponse): boolean {
        const semResposta = falha.status === 0;
        const naoExiste = [404, 405, 501, 502, 503].includes(falha.status);
        const respostaNaoJson = falha.status === 200;

        return semResposta || naoExiste || respostaNaoJson;
    }
}
