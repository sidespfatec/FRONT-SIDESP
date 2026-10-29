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
    pesId: number | null;
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
    { id: 4, nome: 'Futebol' },
    { id: 5, nome: 'Judô' },
    { id: 6, nome: 'Futsal' }
];

export const PROFESSORES_PROVISORIOS: Teacher[] = [
    {
        id: 1, pesId: null, nome: 'Ana Martins', cpf: '32877410055',
        dataNascimento: '1985-02-14', email: 'ana.martins@email.com', telefone: '12998120011',
        registroProfissional: '018221-G/SP', endereco: null,
        modalidades: [{ id: 5, nome: 'Judô' }], curriculoUrl: null, ativo: true
    },
    {
        id: 2, pesId: null, nome: 'Carlos Souza', cpf: '41122309877',
        dataNascimento: '1979-09-03', email: 'carlos.souza@email.com', telefone: '12998120022',
        registroProfissional: '012345-G/SP', endereco: null,
        modalidades: [{ id: 6, nome: 'Futsal' }], curriculoUrl: null, ativo: true
    },
    {
        id: 3, pesId: null, nome: 'Bruna Lima', cpf: '50033128744',
        dataNascimento: '1992-05-27', email: 'bruna.lima@email.com', telefone: '12998120033',
        registroProfissional: '027884-G/SP', endereco: null,
        modalidades: [{ id: 3, nome: 'Vôlei' }], curriculoUrl: null, ativo: true
    },
    {
        id: 4, pesId: null, nome: 'Carla Dias', cpf: '38890077120',
        dataNascimento: '1988-11-09', email: 'carla.dias@email.com', telefone: '12998120044',
        registroProfissional: '031002-G/SP', endereco: null,
        modalidades: [{ id: 2, nome: 'Natação' }], curriculoUrl: null, ativo: true
    }
];

export function modalidadesDe(professor: Teacher): string {
    if (!professor.modalidades?.length) { return 'Sem modalidade'; }
    return professor.modalidades.map(modalidade => modalidade.nome).join(', ');
}
