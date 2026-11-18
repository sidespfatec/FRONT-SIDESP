import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { PerfilProfessor } from './teacher.model';
import { TurmaDoProfessor } from './teacher.model';
import { AlunoDaTurma } from './teacher.model';
import { Aula, Presenca, RegistroDeAula } from './teacher.model';


interface MarcacaoDaApi {
    alunoId: number;
    presenca: Presenca;
}

const API = '/api/v1';


// providedIn: 'root' = existe um só deste service no app inteiro.
@Injectable({ providedIn: 'root' })
export class TeacherService {


    // ESTADO

    perfil = signal<PerfilProfessor | null>(null);   // null = ainda não chegou
    carregando = signal(false);
    erro = signal<string | null>(null);
    alunos = signal<AlunoDaTurma[]>([]);
    aulas = signal<Aula[]>([]);
    registros = signal<RegistroDeAula[]>([]);

    // Presenças por aula: { 101: { 1: 'PRESENTE', 2: 'FALTA' } }
    // A chave de fora é o id da aula; a de dentro, o id do aluno.
    // Objeto em vez de lista porque consultar por id fica imediato.
    chamadas = signal<Record<number, Record<number, Presenca>>>({});

    constructor(private http: HttpClient) { }


    // BUSCAR (GET)

    buscarPerfil(): void {
        this.carregando.set(true);
        this.erro.set(null);

        // O <PerfilProfessor> avisa o TypeScript do que vem na resposta.
        // O subscribe é o que DISPARA a chamada — sem ele nada é enviado.
        this.http.get<PerfilProfessor>(`${API}/professores/me`).subscribe({

            next: (perfil) => {              // deu certo
                this.perfil.set(perfil);
                this.carregando.set(false);
            },

            error: (falha: HttpErrorResponse) => {   // deu errado
                this.erro.set(this.explicarErro(falha));
                this.carregando.set(false);
            }
        });
    }


    // GRAVAR (PATCH)

    // O segundo parâmetro é o corpo que vai no JSON: { "telefone": "..." }
    atualizarTelefone(telefone: string): void {
        const antes = this.perfil();
        if (!antes) { return; }

        // Mostra na tela ANTES da rede responder. Se o servidor recusar,
        // desfaz no error. O professor não fica esperando 3s por um toque.
        this.perfil.set({ ...antes, telefone });

        this.http.patch<PerfilProfessor>(`${API}/professores/me`, { telefone }).subscribe({
            // Usa o que o servidor devolveu, não o que mandamos:

            next: (perfil) => this.perfil.set(perfil),

            error: (falha: HttpErrorResponse) => {
                this.perfil.set(antes);      // desfaz
                this.erro.set(this.explicarErro(falha));
            }
        });
    }



    // Transforma o erro técnico numa frase que o professor entende.

    private explicarErro(falha: HttpErrorResponse): string {
        if (falha.status === 0) { return 'Sem conexão com o servidor.'; }
        if (falha.status === 401) { return 'Sua sessão expirou. Entre novamente.'; }
        if (falha.status === 403) { return 'Você não tem permissão para ver isto.'; }

        // O back manda { codigo, mensagem } nos erros de negócio.
        // O ?? usa o texto da direita quando o da esquerda não existe.
        return falha.error?.mensagem ?? 'Não foi possível carregar os dados.';
    }

    turmas = signal<TurmaDoProfessor[]>([]);

    // Busca as turmas do professor logado. 
    buscarTurmas(): void {
        this.carregando.set(true);
        this.erro.set(null);

        // Repare no [] em TurmaDoProfessor[]: a API devolve um array.
        this.http.get<TurmaDoProfessor[]>(`${API}/professores/me/turmas`).subscribe({

            next: (turmas) => {
                this.turmas.set(turmas);
                this.carregando.set(false);
            },

            error: (falha: HttpErrorResponse) => {
                this.erro.set(this.explicarErro(falha));
                this.carregando.set(false);
            }
        });
    }

    /**
     * Busca os alunos de uma turma.
     *
     * Recebe o turmaId por parâmetro porque, ao contrário do perfil e das
     * turmas, aqui a API precisa saber DE QUAL turma. O `me` dos outros
     * endpoints o back descobre sozinho, pelo token.
     */


    buscarAlunos(turmaId: number): void {
        this.alunos.set([]);        // limpa o que era de outra turma
        this.carregando.set(true);
        this.erro.set(null);

        // Crase (`) e não aspas: é só com crase que o ${turmaId} é trocado
        // pelo valor. Com aspas, a URL iria literalmente com '${turmaId}'.

        this.http.get<AlunoDaTurma[]>(`${API}/turmas/${turmaId}/alunos`).subscribe({

            next: (alunos) => {
                this.alunos.set(alunos);
                this.carregando.set(false);
            },

            error: (falha: HttpErrorResponse) => {
                this.erro.set(this.explicarErro(falha));
                this.carregando.set(false);
            }
        });
    }

    buscarAulas(turmaId: number): void {
        this.aulas.set([]);
        this.http.get<Aula[]>(`${API}/turmas/${turmaId}/aulas`).subscribe({
            next: (aulas) => this.aulas.set(aulas),
            error: (f: HttpErrorResponse) => this.erro.set(this.explicarErro(f))
        });
    }

    buscarRegistros(turmaId: number): void {
        this.registros.set([]);
        this.http.get<RegistroDeAula[]>(`${API}/turmas/${turmaId}/diario`).subscribe({
            next: (registros) => this.registros.set(registros),
            error: (f: HttpErrorResponse) => this.erro.set(this.explicarErro(f))
        });
    }

    /**
     * Busca as presenças já gravadas de UMA aula.
     * A tela chama isto toda vez que o professor troca de data — assim não
     * trazemos o semestre inteiro de presenças de uma vez.
     */

    buscarChamada(aulaId: number): void {
        this.http.get<MarcacaoDaApi[]>(`${API}/aulas/${aulaId}/chamada`).subscribe({
            next: (lista) => {
                // A API manda LISTA; a tela usa OBJETO indexado pelo id do aluno.
                // Converter formato é justamente o trabalho do service.
                const marcacoes: Record<number, Presenca> = {};
                for (const item of lista) {
                    marcacoes[item.alunoId] = item.presenca;
                }
                this.chamadas.update(todas => ({ ...todas, [aulaId]: marcacoes }));
            },
            error: (f: HttpErrorResponse) => {
                // 404 aqui é normal: quer dizer "esta aula ainda não teve chamada"
                if (f.status === 404) { return; }
                this.erro.set(this.explicarErro(f));
            }
        });
    }

    /** Salva a chamada. */
    salvarChamada(aulaId: number, marcacoes: Record<number, Presenca>): void {
        const antes = this.chamadas();

        // Mostra na tela antes da rede responder; desfaz se o servidor recusar.
        this.chamadas.update(todas => ({ ...todas, [aulaId]: { ...marcacoes } }));
        this.trocarSituacao(aulaId, 'SALVA');

        // Object.keys devolve as chaves como TEXTO, por isso o Number(...)
        const corpo = {
            marcacoes: Object.keys(marcacoes).map(alunoId => ({
                alunoId: Number(alunoId),
                presenca: marcacoes[Number(alunoId)]
            }))
        };

        this.http.post(`${API}/aulas/${aulaId}/chamada`, corpo).subscribe({
            next: () => { },
            error: (f: HttpErrorResponse) => {
                this.chamadas.set(antes);
                this.trocarSituacao(aulaId, 'PENDENTE');
                this.erro.set(this.explicarErro(f));
            }
        });
    }

    salvarRegistro(registro: RegistroDeAula): void {
        const antes = this.registros();

        // Tira o registro antigo daquela aula e põe o novo na frente
        this.registros.update(lista => [
            registro,
            ...lista.filter(item => item.aulaId !== registro.aulaId)
        ]);

        this.http.post(`${API}/aulas/${registro.aulaId}/diario`, registro).subscribe({
            next: () => { },
            error: (f: HttpErrorResponse) => {
                this.registros.set(antes);
                this.erro.set(this.explicarErro(f));
            }
        });
    }


    // ---- consultas na memória (não chamam a API) ----

    aulasDaTurma(turmaId: number): Aula[] {
        return this.aulas()
            .filter(aula => aula.turmaId === turmaId)
            // a data é 'aaaa-mm-dd': ordem alfabética = ordem cronológica
            .sort((a, b) => a.data.localeCompare(b.data));
    }

    /** O que já está gravado daquela aula. {} = chamada não feita. */
    marcacoesDaAula(aulaId: number): Record<number, Presenca> {
        return this.chamadas()[aulaId] ?? {};
    }

    private trocarSituacao(aulaId: number, situacao: Aula['situacao']): void {
        // map devolve lista NOVA. Trocar a lista inteira é o que avisa o signal;
        // mexer dentro do objeto antigo não avisaria.
        this.aulas.update(lista => lista.map(aula =>
            aula.id === aulaId ? { ...aula, situacao } : aula
        ));
    }
}