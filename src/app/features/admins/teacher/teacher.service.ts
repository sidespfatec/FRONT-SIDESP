import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Modalidade, Teacher, TeacherPayload } from './teacher.model';

@Injectable({ providedIn: 'root' })
export class TeacherService {

    private http = inject(HttpClient);
    private url = `${environment.apiUrl}/professores`;

    listar(): Observable<Teacher[]> {
        return this.http.get<Teacher[]>(this.url);
    }

    buscar(id: number): Observable<Teacher> {
        return this.http.get<Teacher>(`${this.url}/${id}`);
    }

    criar(payload: TeacherPayload): Observable<Teacher> {
        return this.http.post<Teacher>(this.url, payload);
    }

    atualizar(id: number, payload: TeacherPayload): Observable<Teacher> {
        return this.http.put<Teacher>(`${this.url}/${id}`, payload);
    }

    alterarSituacao(id: number, ativo: boolean): Observable<Teacher> {
        return this.http.patch<Teacher>(`${this.url}/${id}/situacao`, { ativo });
    }

    enviarCurriculo(id: number, arquivo: File): Observable<Teacher> {
        const corpo = new FormData();
        corpo.append('arquivo', arquivo);
        return this.http.post<Teacher>(`${this.url}/${id}/curriculo`, corpo);
    }

    listarModalidades(): Observable<Modalidade[]> {
        return this.http.get<Modalidade[]>(`${environment.apiUrl}/modalidades`);
    }

    apiIndisponivel(falha: HttpErrorResponse): boolean {
        const semResposta = falha.status === 0;
        const naoImplementado = [403, 404, 405, 501, 502, 503].includes(falha.status);
        const respostaNaoJson = falha.status === 200;

        return semResposta || naoImplementado || respostaNaoJson;
    }
}
