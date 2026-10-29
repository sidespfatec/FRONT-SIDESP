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

export const POLOS_OPCOES = [
    'Pedregulho', 'Campo do Galvão', 'Centro', 'Pedrinhas', 'Jardim do Vale'
].map(nome => ({ label: nome, value: nome }));

export const TURMAS_OPCOES = [
    'Futsal Sub-15, Turma A',
    'Futsal Sub-15, Turma B',
    'Natação Infantil, Turma A',
    'Vôlei Sub-17, Turma única',
    'Judô Iniciante, Turma A',
    'Ginástica, Turma B',
    'Atletismo, Turma A'
].map(nome => ({ label: nome, value: nome }));

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

export const ALUNOS: Aluno[] = [
    {
        id: '1',
        nome: 'Mariana Lopes da Silva',
        cpf: '412.885.908-20',
        nascimento: '12/03/2012',
        genero: 'F',
        telefone: '(12) 99812-4470',
        foto: '',
        situacao: 'ativo',
        endereco: {
            cep: '12515-240', rua: 'Rua Dr. Morais Filho', numero: '212',
            complemento: 'Apto 31', bairro: 'Pedregulho', cidade: 'Guaratinguetá', estado: 'SP'
        },
        responsavel: {
            nome: 'Cláudia Lopes da Silva', cpf: '305.112.448-07',
            parentesco: 'Mãe', telefone: '(12) 99745-1180'
        },
        matriculas: [
            {
                id: 'm1', turma: 'Turma A', modalidade: 'Futsal Sub-15', polo: 'Pedregulho',
                horario: 'Segundas e quartas das 8h às 9h', desde: 'março de 2026', situacao: 'ativa'
            },
            {
                id: 'm2', turma: 'Turma B', modalidade: 'Natação Infantil', polo: 'Centro',
                horario: 'Sextas das 14h às 15h', desde: 'agosto de 2026', situacao: 'ativa'
            },
            {
                id: 'm3', turma: 'Turma única', modalidade: 'Vôlei Sub-17', polo: 'Centro',
                horario: 'Terças das 16h às 17h', desde: 'fevereiro de 2026', situacao: 'encerrada'
            }
        ],
        documentos: [
            { tipo: 'Atestado médico', estado: 'vencido', enviadoEm: '12/03/2026', venceEm: '12/09/2026' },
            { tipo: 'Comprovante de residência', estado: 'enviado', enviadoEm: '02/02/2026', venceEm: '' },
            { tipo: 'RG ou certidão de nascimento', estado: 'faltando', enviadoEm: '', venceEm: '' },
            { tipo: 'Autorização do responsável', estado: 'enviado', enviadoEm: '02/02/2026', venceEm: '' },
            { tipo: 'Termo de uso de imagem', estado: 'faltando', enviadoEm: '', venceEm: '' }
        ]
    },
    {
        id: '2',
        nome: 'Pedro Henrique Ramos',
        cpf: '398.774.120-55',
        nascimento: '24/07/2015',
        genero: 'M',
        telefone: '(12) 99634-2201',
        foto: '',
        situacao: 'ativo',
        endereco: {
            cep: '12505-010', rua: 'Rua Marechal Deodoro', numero: '88',
            complemento: '', bairro: 'Centro', cidade: 'Guaratinguetá', estado: 'SP'
        },
        responsavel: {
            nome: 'Sandra Ramos', cpf: '274.908.331-10',
            parentesco: 'Mãe', telefone: '(12) 99634-2201'
        },
        matriculas: [
            {
                id: 'm4', turma: 'Turma A', modalidade: 'Natação Infantil', polo: 'Centro',
                horario: 'Terças e quintas das 9h às 10h', desde: 'abril de 2026', situacao: 'ativa'
            }
        ],
        documentos: comDocumentos('10/04/2026', '10/10/2027')
    },
    {
        id: '3',
        nome: 'Ana Beatriz Fontes',
        cpf: '450.221.907-31',
        nascimento: '05/11/2009',
        genero: 'F',
        telefone: '(12) 98812-7744',
        foto: '',
        situacao: 'ativo',
        endereco: {
            cep: '12505-330', rua: 'Avenida João Pessoa', numero: '1020',
            complemento: 'Casa 2', bairro: 'Centro', cidade: 'Guaratinguetá', estado: 'SP'
        },
        responsavel: {
            nome: 'Marcos Fontes', cpf: '188.445.270-99',
            parentesco: 'Pai', telefone: '(12) 98812-7744'
        },
        matriculas: [
            {
                id: 'm5', turma: 'Turma única', modalidade: 'Vôlei Sub-17', polo: 'Centro',
                horario: 'Terças das 16h às 17h', desde: 'março de 2026', situacao: 'ativa'
            }
        ],
        documentos: comDocumentos('01/03/2026', '01/09/2027')
    },
    {
        id: '4',
        nome: 'Lucas Moreira Dias',
        cpf: '501.337.228-04',
        nascimento: '19/01/2017',
        genero: 'M',
        telefone: '(12) 99120-5566',
        foto: '',
        situacao: 'ativo',
        endereco: {
            cep: '12522-180', rua: 'Rua das Palmeiras', numero: '45',
            complemento: '', bairro: 'Pedrinhas', cidade: 'Guaratinguetá', estado: 'SP'
        },
        responsavel: {
            nome: 'Fernanda Moreira', cpf: '329.774.015-62',
            parentesco: 'Mãe', telefone: '(12) 99120-5566'
        },
        matriculas: [
            {
                id: 'm6', turma: 'Turma A', modalidade: 'Judô Iniciante', polo: 'Pedrinhas',
                horario: 'Quartas das 15h às 16h', desde: 'maio de 2026', situacao: 'ativa'
            }
        ],
        documentos: semDocumentos()
    },
    {
        id: '5',
        nome: 'Juliana Alves Prado',
        cpf: '477.009.513-88',
        nascimento: '30/06/2013',
        genero: 'F',
        telefone: '(12) 99408-1172',
        foto: '',
        situacao: 'trancado',
        endereco: {
            cep: '12530-400', rua: 'Rua Benedito Siqueira', numero: '307',
            complemento: '', bairro: 'Jardim do Vale', cidade: 'Guaratinguetá', estado: 'SP'
        },
        responsavel: {
            nome: 'Patrícia Alves', cpf: '255.610.843-20',
            parentesco: 'Mãe', telefone: '(12) 99408-1172'
        },
        matriculas: [
            {
                id: 'm7', turma: 'Turma B', modalidade: 'Ginástica', polo: 'Jardim do Vale',
                horario: 'Quintas das 10h às 11h', desde: 'março de 2026', situacao: 'encerrada'
            }
        ],
        documentos: comDocumentos('03/03/2026', '03/09/2027')
    },
    {
        id: '6',
        nome: 'Rafael Siqueira Nunes',
        cpf: '389.556.740-12',
        nascimento: '08/09/2011',
        genero: 'M',
        telefone: '(12) 99233-8890',
        foto: '',
        situacao: 'ativo',
        endereco: {
            cep: '12515-100', rua: 'Rua Coronel Ribeiro', numero: '19',
            complemento: 'Fundos', bairro: 'Pedregulho', cidade: 'Guaratinguetá', estado: 'SP'
        },
        responsavel: {
            nome: 'Elaine Siqueira', cpf: '301.228.665-47',
            parentesco: 'Mãe', telefone: '(12) 99233-8890'
        },
        matriculas: [
            {
                id: 'm8', turma: 'Turma B', modalidade: 'Futsal Sub-15', polo: 'Pedregulho',
                horario: 'Terças e quintas das 14h às 15h', desde: 'março de 2026', situacao: 'ativa'
            }
        ],
        documentos: comDocumentos('05/03/2026', '05/09/2027')
    },
    {
        id: '7',
        nome: 'Camila Duarte Rocha',
        cpf: '432.118.906-73',
        nascimento: '02/02/2014',
        genero: 'F',
        telefone: '(12) 99501-3344',
        foto: '',
        situacao: 'ativo',
        endereco: {
            cep: '12518-070', rua: 'Rua Santa Luzia', numero: '560',
            complemento: '', bairro: 'Campo do Galvão', cidade: 'Guaratinguetá', estado: 'SP'
        },
        responsavel: {
            nome: 'Rogério Duarte', cpf: '219.887.334-05',
            parentesco: 'Pai', telefone: '(12) 99501-3344'
        },
        matriculas: [
            {
                id: 'm9', turma: 'Turma A', modalidade: 'Atletismo', polo: 'Campo do Galvão',
                horario: 'Segundas das 17h às 18h', desde: 'abril de 2026', situacao: 'ativa'
            }
        ],
        documentos: comDocumentos('01/04/2026', '01/10/2027')
    }
];

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
