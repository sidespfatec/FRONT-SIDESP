export type Aba = 'turmas' | 'frequencia' | 'documentos' | 'dados';
export type StatusAula = 'presente' | 'falta' | 'cancelada';
export type SituacaoDocumento = 'vencendo' | 'pendente' | 'entregue';

export interface Turma {
    id: number;
    modalidade: string;
    nome: string;
    polo: string;
    professor: string;
    dias: string;
    horario: string;
    aulas: number;
    presencas: number;
}

export interface Aula {
    data: string;
    turmaId: number;
    status: StatusAula;
}

export interface DocumentoAluno {
    id: number;
    nome: string;
    situacao: SituacaoDocumento;
    detalhe: string;
}

export interface PerfilAluno {
    nome: string;
    foto: string;
    nascimento: string;
    cpf: string;
    genero: string;
    entrada: string;
    ativo: boolean;
    prazoDocumentos: string;
    telefone: string;
    email: string;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
    turmas: Turma[];
    documentos: DocumentoAluno[];
}

export interface DiaCalendario {
    numero: number;
    data: string;
    status: StatusAula | '';
}