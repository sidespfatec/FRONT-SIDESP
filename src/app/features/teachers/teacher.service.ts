import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Aula, AlunoDaTurma, Presenca, PerfilProfessor, RegistroDeAula, TurmaDoProfessor,
    ALUNOS_PROVISORIOS, AULAS_PROVISORIAS, REGISTROS_PROVISORIOS, TURMAS_PROVISORIAS
} from './teacher.model';
import { PerfilService } from '../../core/perfil/perfil.service';

/**
 * Fonte unica de dados da area do professor.
 *
 * Hoje tudo vive em memoria, em signals. Quando os endpoints existirem:
 *   - cada signal de leitura vira o resultado de um this.http.get(...)
 *   - cada metodo de gravacao vira um this.http.post(...) / patch(...)
 * As telas nao mudam, porque elas so conversam com este service.
 */
@Injectable({ providedIn: 'root' })
export class TeacherService {

    // O underline marca o signal "de dentro", que so o service altera.
    // Para fora expomos a versao readonly, assim nenhuma tela escreve no estado por engano.
    private readonly conta = inject(PerfilService);

    private readonly _turmas = signal<TurmaDoProfessor[]>(TURMAS_PROVISORIAS);
    private readonly _aulas = signal<Aula[]>(AULAS_PROVISORIAS);
    private readonly _alunos = signal<AlunoDaTurma[]>(ALUNOS_PROVISORIOS);
    private readonly _registros = signal<RegistroDeAula[]>(REGISTROS_PROVISORIOS);

    // Chamada guardada por aula: { [aulaId]: { [alunoId]: 'PRESENTE' | ... } }
    private readonly _chamadas = signal<Record<number, Record<number, Presenca>>>({});

    //monta a ficha com o que o GET /perfil devolve; registro e especialidade não vêm nele
    readonly perfil = computed<PerfilProfessor | null>(() => {
        const dados = this.conta.perfil();
        if (!dados) { return null; }

        return {
            id: 0,
            nome: dados.nome,
            cpf: '',
            dataNascimento: dados.dataNascimento,
            sexo: dados.genero,
            telefone: this.conta.telefone(),
            registroProfissional: '',
            especialidade: ''
        };
    });

    readonly carregando = this.conta.carregando;
    readonly erro = this.conta.erro;

    readonly turmas = this._turmas.asReadonly();
    readonly aulas = this._aulas.asReadonly();

    constructor() {
        this.preencherChamadasJaSalvas();
    }

    buscarPerfil(): void {
        this.conta.buscarPerfil();
    }

    /** Devolve o Observable: quem decide o que fazer depois é a tela. */
    atualizarTelefone(telefone: string): Observable<void> {
        return this.conta.salvarTelefone(telefone);
    }

    turmaPorId(id: number): TurmaDoProfessor | undefined {
        return this._turmas().find(turma => turma.id === id);
    }

    /** Aulas da turma em ordem cronologica (a mais antiga primeiro). */
    aulasDaTurma(turmaId: number): Aula[] {
        return this._aulas()
            .filter(aula => aula.turmaId === turmaId)
            .sort((a, b) => a.data.localeCompare(b.data));
    }

    aulaPorId(aulaId: number): Aula | undefined {
        return this._aulas().find(aula => aula.id === aulaId);
    }

    // Provisorio: devolve a mesma lista para qualquer turma, porque os dados de exemplo
    // nao tem vinculo aluno-turma. O endpoint real vai filtrar pelo turmaId.
    alunosDaTurma(turmaId: number): AlunoDaTurma[] {
        return this._alunos();
    }

    /** Marcacoes ja gravadas daquela aula. Vazio = chamada ainda nao feita. */
    marcacoesDaAula(aulaId: number): Record<number, Presenca> {
        return this._chamadas()[aulaId] ?? {};
    }

    salvarChamada(aulaId: number, marcacoes: Record<number, Presenca>): void {
        // update() recebe o valor atual e devolve um NOVO objeto. Trocar o objeto inteiro
        // (em vez de alterar o antigo) e o que faz o Angular perceber a mudanca.
        this._chamadas.update(todas => ({ ...todas, [aulaId]: { ...marcacoes } }));
        this.mudarSituacao(aulaId, aula => ({ ...aula, situacao: 'SALVA', motivoCancelamento: undefined }));
    }

    cancelarAula(aulaId: number, motivo: string): void {
        this.mudarSituacao(aulaId, aula => ({ ...aula, situacao: 'CANCELADA', motivoCancelamento: motivo }));
    }

    desfazerCancelamento(aulaId: number): void {
        this.mudarSituacao(aulaId, aula => ({ ...aula, situacao: 'PENDENTE', motivoCancelamento: undefined }));
    }

    registroDaAula(aulaId: number): RegistroDeAula | undefined {
        return this._registros().find(registro => registro.aulaId === aulaId);
    }

    registrosDaTurma(turmaId: number): RegistroDeAula[] {
        const idsDaTurma = this.aulasDaTurma(turmaId).map(aula => aula.id);
        return this._registros()
            .filter(registro => idsDaTurma.includes(registro.aulaId))
            .sort((a, b) => b.aulaId - a.aulaId);
    }

    salvarRegistro(registro: RegistroDeAula): void {
        this._registros.update(lista => [
            registro,
            ...lista.filter(item => item.aulaId !== registro.aulaId)
        ]);
    }

    /** Aplica uma mudanca em UMA aula, mantendo o resto da lista intacto. */
    private mudarSituacao(aulaId: number, mudanca: (aula: Aula) => Aula): void {
        this._aulas.update(lista => lista.map(aula => aula.id === aulaId ? mudanca(aula) : aula));
    }

    /**
     * So para a demonstracao: as aulas que ja nascem com situacao SALVA precisam ter
     * marcacoes, senao abrir uma delas mostraria a chamada em branco.
     * Some junto com os dados provisorios.
     */
    private preencherChamadasJaSalvas(): void {
        const geradas: Record<number, Record<number, Presenca>> = {};

        for (const aula of this._aulas()) {
            if (aula.situacao !== 'SALVA') {
                continue;
            }
            const marcacoes: Record<number, Presenca> = {};
            for (const aluno of this._alunos()) {
                const sorteio = (aula.id * 31 + aluno.id * 7) % 100;
                marcacoes[aluno.id] = sorteio < 80 ? 'PRESENTE' : sorteio < 93 ? 'FALTA' : 'JUSTIFICADA';
            }
            geradas[aula.id] = marcacoes;
        }

        this._chamadas.set(geradas);
    }
}
