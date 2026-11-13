export interface Relatorio {
    id: string;
    nome: string;
    descricao: string;
    dependeChamada: boolean;
    pedeTurma: boolean;
    pedePolo: boolean;
    pedePeriodo: boolean;
}

export interface ExportacaoRecente {
    relatorio: string;
    recorte: string;
    quando: string;
    autor: string;
}

export const RELATORIOS: Relatorio[] = [
    {
        id: 'presenca',
        nome: 'Lista de presença',
        descricao: 'A folha da turma para imprimir e assinar na aula, com os nomes e os dias do mês.',
        dependeChamada: false, pedeTurma: true, pedePolo: false, pedePeriodo: true
    },
    {
        id: 'frequencia',
        nome: 'Frequência por aluno',
        descricao: 'Quantas aulas cada pessoa teve e quantas faltou, no período escolhido.',
        dependeChamada: true, pedeTurma: true, pedePolo: false, pedePeriodo: true
    },
    {
        id: 'inscricoes',
        nome: 'Inscrições do período',
        descricao: 'Quem se inscreveu, em qual turma e quando, para conferência e prestação de contas.',
        dependeChamada: false, pedeTurma: false, pedePolo: true, pedePeriodo: true
    },
    {
        id: 'vagas',
        nome: 'Ocupação de vagas',
        descricao: 'Quantas vagas cada turma tem, quantas estão ocupadas e quantas sobram.',
        dependeChamada: false, pedeTurma: false, pedePolo: true, pedePeriodo: false
    },
    {
        id: 'espera',
        nome: 'Lista de espera',
        descricao: 'Quem está esperando vaga, por turma, na ordem em que se inscreveu.',
        dependeChamada: false, pedeTurma: true, pedePolo: false, pedePeriodo: false
    },
    {
        id: 'professores',
        nome: 'Turmas por professor',
        descricao: 'O que cada professor leciona, em quais dias, horários e quadras.',
        dependeChamada: false, pedeTurma: false, pedePolo: true, pedePeriodo: false
    }
];

export const EXPORTACOES_RECENTES: ExportacaoRecente[] = [];

export const TURMAS_OPCOES = [] as {label: string; value: string}[];

export const POLOS_OPCOES = [] as {label: string; value: string}[];
