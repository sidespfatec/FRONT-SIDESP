export type SituacaoAluno = 'nenhuma' | 'matriculada' | 'na-lista';
export type EstadoTurma = 'aberta' | 'matriculada' | 'na-lista' | 'cheia-lista' | 'cheia' | 'fora-idade';
export type AcaoTurma = 'inscrever' | 'entrar-lista' | 'cancelar' | 'sair-lista';

export interface TurmaEsporte {
    id: number;
    nome: string;
    polo: string;
    professor: string;
    dias: string;
    horario: string;
    idadeMinima: number;
    idadeMaxima: number;
    vagas: number;
    ocupadas: number;
    listaEspera: boolean;
    tamanhoLista: number;
    situacao: SituacaoAluno;
    posicao: number;
}

export interface Esporte {
    id: number;
    nome: string;
    icone: string;
    turmas: TurmaEsporte[];
}