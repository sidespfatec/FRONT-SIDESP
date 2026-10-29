export interface Endereco {
    cep: string;
    rua: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface Modalidade {
    id: number;
    nome: string;
}

export interface Teacher {
    id: number;
    pesId: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    registroProfissional: string | null;
    endereco: Endereco | null;
    modalidades: Modalidade[];
    curriculoUrl: string | null;
    ativo: boolean;
}

export interface TeacherPayload {
    pesId: number | null;
    nome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    registroProfissional: string | null;
    endereco: Endereco;
    modalidadeIds: number[];
}

export const MODALIDADES_PROVISORIAS: Modalidade[] = [
    { id: 1, nome: 'Educação física' },
    { id: 2, nome: 'Natação' },
    { id: 3, nome: 'Vôlei' },
    { id: 4, nome: 'Futebol' }
];
