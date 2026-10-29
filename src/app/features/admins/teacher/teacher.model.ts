export type Sexo = 'M' | 'F';

export interface Teacher {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    sexo: Sexo;
    telefone: string;
    registroProfissional: string;
    especialidade: string;
    ativo: boolean;
}

export interface TeacherPayload {
    nome: string;
    cpf: string;
    dataNascimento: string;
    sexo: Sexo;
    telefone: string;
    registroProfissional: string;
    especialidade: string;
}

export interface CadastroResultado {
    id: number;
    mensagem: string;
}

export interface ApiErro {
    codigo: string;
    mensagem: string;
    errosCampos?: Record<string, string>;
}

export const SEXO_OPCOES: { label: string; value: Sexo }[] = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' }
];

export const ESPECIALIDADES = [
    'Educação física',
    'Natação',
    'Vôlei',
    'Futebol',
    'Futsal',
    'Judô',
    'Atletismo',
    'Ginástica'
].map(nome => ({ label: nome, value: nome }));

export const PROFESSORES_PROVISORIOS: Teacher[] = [
    {
        id: 1, nome: 'Ana Martins', cpf: '32877410055', dataNascimento: '1985-02-14',
        sexo: 'F', telefone: '12998120011', registroProfissional: '018221-G/SP',
        especialidade: 'Judô', ativo: true
    },
    {
        id: 2, nome: 'Carlos Souza', cpf: '41122309877', dataNascimento: '1979-09-03',
        sexo: 'M', telefone: '12998120022', registroProfissional: '012345-G/SP',
        especialidade: 'Futsal', ativo: true
    },
    {
        id: 3, nome: 'Bruna Lima', cpf: '50033128744', dataNascimento: '1992-05-27',
        sexo: 'F', telefone: '12998120033', registroProfissional: '027884-G/SP',
        especialidade: 'Vôlei', ativo: true
    },
    {
        id: 4, nome: 'Carla Dias', cpf: '38890077120', dataNascimento: '1988-11-09',
        sexo: 'F', telefone: '12998120044', registroProfissional: '031002-G/SP',
        especialidade: 'Natação', ativo: true
    }
];
