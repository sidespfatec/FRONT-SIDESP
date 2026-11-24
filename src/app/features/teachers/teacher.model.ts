export type Sexo = 'M' | 'F';

/** Situacao de uma aula especifica no calendario da turma. */
export type SituacaoAula = 'PENDENTE' | 'SALVA' | 'CANCELADA';

/** Como o aluno foi marcado na chamada daquela aula. */
export type Presenca = 'PRESENTE' | 'FALTA' | 'JUSTIFICADA';

/** Dados cadastrais do professor logado. Os sete campos que o back ja recebe no cadastro. */
export interface PerfilProfessor {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    sexo: Sexo;
    telefone: string;
    registroProfissional: string;
    especialidade: string;
}

export interface TurmaDoProfessor {
    id: number;
    modalidade: string;
    nome: string;
    polo: string;

    // Dias da semana no padrao do JavaScript: 0 = domingo, 6 = sábado.
    // Guardamos como numero (e nao como "Ter e Qui") para a aba Agenda conseguir
    // filtrar por dia sem procurar texto dentro de string.
    diasSemana: number[];

    horaInicio: string;
    horaFim: string;
    totalAlunos: number;
    vagas: number;

    // Os três campos abaixo são calculados em cima da chamada.
    // Ficou decidido que quem calcula e o back-end, e manda pronto nesta resposta.
    frequenciaMedia: number;
    alunosEmRisco: number;    // alunos com 3 ou mais faltas seguidas
    chamadaPendente: boolean; // existe QUALQUER aula já ocorrida sem chamada salva
}

export interface Aula {
    id: number;
    turmaId: number;
    data: string;             // sempre no formato 'aaaa-mm-dd'
    situacao: SituacaoAula;
    motivoCancelamento?: string;
}

/** Ficha de saude do aluno. Dado sensivel: o professor ve o minimo para agir numa emergencia. */
export interface FichaSaude {
    condicoes: string;
    alergias: string;
    medicacao: string;
    atendimento: string;
}

export interface AlunoDaTurma {
    id: number;
    nome: string;
    idade: number;
    frequencia: number;
    faltasSeguidas: number;
    responsavel: string;
    parentesco: string;
    telefone: string;
    endereco: string;
    fichaSaude?: FichaSaude;  // ausente = sem restrição registrada
}

export type TipoOcorrencia = 'MATERIAL' | 'ESTRUTURA' | 'ALUNO' | 'COMPORTAMENTO' | 'OUTRO';

export type StatusOcorrencia = 'ABERTO' | 'EM_ANDAMENTO' | 'RESOLVIDO';

export interface Ocorrencia {
    tipo: TipoOcorrencia;
    descricao: string;
    status: StatusOcorrencia;
}

/** O que foi dado na aula e o que aconteceu de diferente nela. */
export interface RegistroDeAula {
    aulaId: number;
    conteudo: string;
    ocorrencias: Ocorrencia[];
}

export const MOTIVOS_CANCELAMENTO = [
    'Feriado',
    'Chuva',
    'Manutenção do espaço',
    'Ausência do professor',
    'Outro motivo'
];

// Record<Chave, string> obriga o TypeScript a cobrar um rotulo para CADA valor do tipo.
// Se amanha alguem criar um quarto tipo de presenca, o compilador aponta este objeto.
export const ROTULO_PRESENCA: Record<Presenca, string> = {
    PRESENTE: 'Presente',
    FALTA: 'Falta',
    JUSTIFICADA: 'Justificada'
};

export const ROTULO_SITUACAO: Record<SituacaoAula, string> = {
    PENDENTE: 'pendente',
    SALVA: 'chamada salva',
    CANCELADA: 'aula cancelada'
};

export const ROTULO_OCORRENCIA: Record<TipoOcorrencia, string> = {
    MATERIAL: 'Material danificado',
    ESTRUTURA: 'Estrutura do espaço',
    ALUNO: 'Aluno se machucou',
    COMPORTAMENTO: 'Comportamento',
    OUTRO: 'Outro'
};

export const ROTULO_STATUS: Record<StatusOcorrencia, string> = {
    ABERTO: 'aberto',
    EM_ANDAMENTO: 'em andamento',
    RESOLVIDO: 'resolvido'
};

/** Tipos de ocorrencia que viram chamado de manutencao para a secretaria. */
export const OCORRENCIAS_QUE_ABREM_CHAMADO: TipoOcorrencia[] = ['MATERIAL', 'ESTRUTURA'];

const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const DIAS_LONGOS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

/**
 * Converte 'aaaa-mm-dd' em Date no fuso LOCAL.
 *
 * Importante: new Date('2026-11-03') e interpretado como UTC pelo JavaScript.
 * No Brasil (UTC-3) isso vira dia 2 as 21h, e a aula de terça apareceria na segunda.
 * Por isso quebramos a string na mão e montamos com ano, mês e dia separados.
 */
export function dataLocal(iso: string): Date {
    const [ano, mes, dia] = iso.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}

export function diaCurto(iso: string): string {
    return DIAS_CURTOS[dataLocal(iso).getDay()];
}

export function diaPorExtenso(iso: string): string {
    return DIAS_LONGOS[dataLocal(iso).getDay()];
}

/** '2026-11-03' vira '03/11'. */
export function diaMes(iso: string): string {
    const d = dataLocal(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** '2026-11-03' vira 'Novembro de 2026'. Usado para agrupar a lista de aulas por mes. */
export function mesAno(iso: string): string {
    const d = dataLocal(iso);
    const nome = MESES[d.getMonth()];
    return `${nome[0].toUpperCase()}${nome.slice(1)} de ${d.getFullYear()}`;
}

export function ehHoje(iso: string): boolean {
    const hoje = new Date();
    const d = dataLocal(iso);
    return d.getDate() === hoje.getDate()
        && d.getMonth() === hoje.getMonth()
        && d.getFullYear() === hoje.getFullYear();
}

export function ehFuturo(iso: string): boolean {
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    return dataLocal(iso) > hoje;
}

export function nomeDoDia(dia: number): string {
    return DIAS_LONGOS[dia];
}

/** [2, 4] vira 'Ter e Qui'. [2, 4, 6] vira 'Ter, Qui e Sab'. */
export function rotuloDias(dias: number[]): string {
    const nomes = dias.map(d => DIAS_CURTOS[d]);
    if (nomes.length <= 1) {
        return nomes.join('');
    }
    return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

/** Duracao da aula em horas. '15h30' ate '16h30' devolve 1. */
export function duracaoEmHoras(inicio: string, fim: string): number {
    const minutos = (hora: string) => {
        const [h, m] = hora.replace('h', ':').split(':');
        return Number(h) * 60 + Number(m || 0);
    };
    return (minutos(fim) - minutos(inicio)) / 60;
}

export const PERFIL_PROVISORIO: PerfilProfessor = {
    id: 1,
    nome: 'Ricardo Alves de Campos',
    cpf: '318.442.770-09',
    dataNascimento: '1988-07-04',
    sexo: 'M',
    telefone: '(12) 99645-2210',
    registroProfissional: 'CREF 012345-G/SP',
    especialidade: 'Natação'
};

export const TURMAS_PROVISORIAS: TurmaDoProfessor[] = [
    {
        id: 1, modalidade: 'Natação', nome: 'Infantil A', polo: 'Polo Centro',
        diasSemana: [2, 4], horaInicio: '14h00', horaFim: '15h00',
        totalAlunos: 12, vagas: 20, frequenciaMedia: 91, alunosEmRisco: 0, chamadaPendente: true
    },
    {
        id: 2, modalidade: 'Natação', nome: 'Infantil B', polo: 'Polo Centro',
        diasSemana: [2, 4], horaInicio: '15h30', horaFim: '16h30',
        totalAlunos: 6, vagas: 20, frequenciaMedia: 84, alunosEmRisco: 2, chamadaPendente: true
    },
    {
        id: 3, modalidade: 'Natação', nome: 'Sub-18 Competição', polo: 'Polo Pedregulho',
        diasSemana: [2, 4, 6], horaInicio: '17h00', horaFim: '19h00',
        totalAlunos: 8, vagas: 18, frequenciaMedia: 95, alunosEmRisco: 0, chamadaPendente: false
    }
];

/**
 * Devolve a data de N dias atrás no formato 'aaaa-mm-dd'.
 */
function diasAtras(quantos: number): string {
    const d = new Date();
    d.setDate(d.getDate() - quantos);
    return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0')
    ].join('-');
}

/**
 * As aulas são geradas a partir de HOJE, e não escritas com data fixa.
 *
 * Com data fixa no código, depois de uma semana nenhuma aula cairia em "hoje":
 * o chip "hoje" sumiria da tira e o aviso de chamada atrasada nunca apareceria,
 * que é justamente o que precisa funcionar numa demonstração.
 */
const ROTEIRO_AULAS: { turmaId: number; atras: number; situacao: SituacaoAula; motivo?: string }[] = [
    { turmaId: 2, atras: 0, situacao: 'PENDENTE' },
    { turmaId: 2, atras: 2, situacao: 'SALVA' },
    { turmaId: 2, atras: 5, situacao: 'PENDENTE' },
    { turmaId: 2, atras: 7, situacao: 'SALVA' },
    { turmaId: 2, atras: 9, situacao: 'CANCELADA', motivo: 'Chuva' },
    { turmaId: 2, atras: 12, situacao: 'SALVA' },
    { turmaId: 2, atras: 14, situacao: 'SALVA' },

    { turmaId: 1, atras: 0, situacao: 'PENDENTE' },
    { turmaId: 1, atras: 2, situacao: 'SALVA' },
    { turmaId: 1, atras: 5, situacao: 'SALVA' },

    { turmaId: 3, atras: 2, situacao: 'SALVA' },
    { turmaId: 3, atras: 4, situacao: 'SALVA' }
];

export const AULAS_PROVISORIAS: Aula[] = ROTEIRO_AULAS.map((item, indice) => ({
    id: 100 + indice,
    turmaId: item.turmaId,
    data: diasAtras(item.atras),
    situacao: item.situacao,
    motivoCancelamento: item.motivo
}));

export const ALUNOS_PROVISORIOS: AlunoDaTurma[] = [
    {
        id: 1, nome: 'Mariana Lopes da Silva', idade: 14, frequencia: 83, faltasSeguidas: 0,
        responsavel: 'Ana Lopes da Silva', parentesco: 'Mãe', telefone: '(12) 99704-1188',
        endereco: 'Rua Dr. Morais Filho, 212 - Centro',
        fichaSaude: {
            condicoes: 'Asma', alergias: 'Nenhuma conhecida',
            medicacao: 'Bombinha de salbutamol (traz na mochila)', atendimento: 'SUS - UBS Centro'
        }
    },
    {
        id: 2, nome: 'Pedro Henrique Dias', idade: 13, frequencia: 52, faltasSeguidas: 3,
        responsavel: 'Marcos Dias', parentesco: 'Pai', telefone: '(12) 99120-3345',
        endereco: 'Rua Bento Pereira, 78 - Pedregulho'
    },
    {
        id: 3, nome: 'Ana Clara Moreira', idade: 14, frequencia: 96, faltasSeguidas: 0,
        responsavel: 'Sueli Moreira', parentesco: 'Mãe', telefone: '(12) 98844-7711',
        endereco: 'Av. João Pessoa, 1040 - Vila Paraíba'
    },
    {
        id: 4, nome: 'Lucas Ferreira Pinto', idade: 13, frequencia: 88, faltasSeguidas: 0,
        responsavel: 'Renata Pinto', parentesco: 'Mãe', telefone: '(12) 99233-8890',
        endereco: 'Rua Oswaldo Cruz, 55 - Centro',
        fichaSaude: {
            condicoes: 'Nenhuma', alergias: 'Amendoim (reação grave)',
            medicacao: 'Antialérgico na mochila', atendimento: 'Unimed'
        }
    },
    {
        id: 5, nome: 'Beatriz Nunes', idade: 14, frequencia: 91, faltasSeguidas: 0,
        responsavel: 'Carlos Nunes', parentesco: 'Pai', telefone: '(12) 99015-2277',
        endereco: 'Rua Marechal Deodoro, 320 - Centro'
    },
    {
        id: 6, nome: 'Laura Prado', idade: 13, frequencia: 61, faltasSeguidas: 4,
        responsavel: 'Débora Prado', parentesco: 'Mãe', telefone: '(12) 98700-6621',
        endereco: 'Rua Dr. Castro Santos, 12 - Campo do Galvão'
    }
];

export const REGISTROS_PROVISORIOS: RegistroDeAula[] = [
    { aulaId: 101, conteudo: 'Nado crawl — respiração lateral. 6 séries de 25m.', ocorrencias: [] },
    {
        aulaId: 103, conteudo: 'Revisão de pernada e flutuação. Trabalho em duplas.',
        ocorrencias: [{ tipo: 'MATERIAL', descricao: 'Bola de hidroginástica furada no aquecimento.', status: 'EM_ANDAMENTO' }]
    },
    {
        aulaId: 105, conteudo: 'Saída do bloco e viradas.',
        ocorrencias: [{ tipo: 'ESTRUTURA', descricao: 'Lâmpada do vestiário masculino queimada.', status: 'RESOLVIDO' }]
    }
];
