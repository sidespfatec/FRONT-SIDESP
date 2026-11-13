export type Genero = 'M' | 'F';
export type SituacaoAluno = 'ativo' | 'trancado';
export type SituacaoMatricula = 'ativa' | 'encerrada';
export type EstadoDocumento = 'enviado' | 'vencido' | 'faltando';

export interface Endereco {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface Responsavel {
    nome: string;
    cpf: string;
    parentesco: string;
    telefone: string;
}

export interface Matricula {
    id: string;
    turma: string;
    modalidade: string;
    polo: string;
    horario: string;
    desde: string;
    situacao: SituacaoMatricula;
}

export interface Documento {
    tipo: string;
    estado: EstadoDocumento;
    enviadoEm: string;
    venceEm: string;
}

export interface Aluno {
    id: string;
    nome: string;
    cpf: string;
    nascimento: string;
    genero: Genero;
    telefone: string;
    foto: string;
    situacao: SituacaoAluno;
    endereco: Endereco;
    responsavel: Responsavel;
    matriculas: Matricula[];
    documentos: Documento[];
}

export const GENERO_OPCOES: { label: string; value: Genero }[] = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' }
];

export const GENERO_ROTULO: Record<Genero, string> = {
    M: 'Masculino',
    F: 'Feminino'
};

export const POLOS_OPCOES = [] as {label: string; value: string}[];

export const TURMAS_OPCOES = [] as {label: string; value: string}[];

export const SITUACAO_OPCOES = [
    { label: 'Só ativos', value: 'ativo' },
    { label: 'Todos', value: 'todos' }
];

export const DOCUMENTOS_EXIGIDOS = [
    'Atestado médico',
    'Comprovante de residência',
    'RG ou certidão de nascimento',
    'Autorização do responsável',
    'Termo de uso de imagem'
];

function semDocumentos(): Documento[] {
    return DOCUMENTOS_EXIGIDOS.map(tipo => ({
        tipo, estado: 'faltando' as EstadoDocumento, enviadoEm: '', venceEm: ''
    }));
}

function comDocumentos(enviadoEm: string, venceEm: string): Documento[] {
    return DOCUMENTOS_EXIGIDOS.map(tipo => ({
        tipo,
        estado: 'enviado' as EstadoDocumento,
        enviadoEm,
        venceEm: tipo === 'Atestado médico' ? venceEm : ''
    }));
}

export const ALUNOS: Aluno[] = [];

export function idadeDe(nascimento: string): number {
    const partes = nascimento.split('/').map(Number);
    const hoje = new Date();
    let idade = hoje.getFullYear() - partes[2];
    const aniversario = new Date(hoje.getFullYear(), partes[1] - 1, partes[0]);
    if (hoje < aniversario) { idade--; }
    return idade;
}

export function pendenciasDe(aluno: Aluno): number {
    return aluno.documentos.filter(documento => documento.estado !== 'enviado').length;
}

export function matriculaAtual(aluno: Aluno): Matricula | undefined {
    return aluno.matriculas.find(matricula => matricula.situacao === 'ativa') ?? aluno.matriculas[0];
}

export function turmasAtivasDe(aluno: Aluno): number {
    return aluno.matriculas.filter(matricula => matricula.situacao === 'ativa').length;
}
