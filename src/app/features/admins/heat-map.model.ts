export type Eixo = 'mes' | 'polo' | 'modalidade' | 'idade';
export type Serie = 'nenhum' | 'genero';

export interface SerieComparada {
    rotulos: string[];
    total: number[];
    meninas: number[];
    meninos: number[];
    ordenar: boolean;
    horizontal: boolean;
}

export const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const COMPARAR_POR: { label: string; value: Eixo }[] = [
    { label: 'mês', value: 'mes' },
    { label: 'polo', value: 'polo' },
    { label: 'modalidade', value: 'modalidade' },
    { label: 'faixa etária', value: 'idade' }
];

export const SEPARAR_POR: { label: string; value: Serie }[] = [
    { label: 'nada', value: 'nenhum' },
    { label: 'gênero', value: 'genero' }
];

export const TITULOS: Record<Eixo, string> = {
    mes: 'Inscritos por mês',
    polo: 'Inscritos por polo',
    modalidade: 'Inscritos por modalidade',
    idade: 'Inscritos por faixa etária'
};

export const NOTAS: Record<Eixo, string> = {
    mes: 'A queda de julho é o recesso escolar.',
    polo: 'Ordenado do maior para o menor.',
    modalidade: 'Ordenado do maior para o menor.',
    idade: 'Faixas na ordem de idade.'
};

export const DADOS: Record<Eixo, SerieComparada> = {
    mes: {
        rotulos: MESES, ordenar: false, horizontal: false,
        total: [410, 620, 880, 960, 910, 820, 430, 760, 900, 950, 870, 600],
        meninas: [238, 360, 510, 557, 528, 476, 249, 441, 522, 551, 505, 348],
        meninos: [172, 260, 370, 403, 382, 344, 181, 319, 378, 399, 365, 252]
    },
    polo: {
        rotulos: ['Pedregulho', 'Campo do Galvão', 'Centro', 'Pedrinhas', 'Jardim do Vale'],
        ordenar: true, horizontal: true,
        total: [412, 388, 301, 244, 180],
        meninas: [239, 225, 174, 142, 104],
        meninos: [173, 163, 127, 102, 76]
    },
    modalidade: {
        rotulos: ['Futebol', 'Natação', 'Vôlei', 'Judô', 'Atletismo', 'Ginástica'],
        ordenar: true, horizontal: true,
        total: [520, 340, 268, 152, 131, 97],
        meninas: [218, 215, 186, 70, 74, 68],
        meninos: [302, 125, 82, 82, 57, 29]
    },
    idade: {
        rotulos: ['6 a 9', '10 a 14', '15 a 17', '18 a 29', '30+'],
        ordenar: false, horizontal: false,
        total: [210, 486, 332, 128, 92],
        meninas: [118, 284, 190, 74, 58],
        meninos: [92, 202, 142, 54, 34]
    }
};

export const POLOS_OPCOES = [
    'Pedregulho', 'Campo do Galvão', 'Centro', 'Pedrinhas', 'Jardim do Vale'
].map(nome => ({ label: nome, value: nome }));

export const MODALIDADES_OPCOES = [
    'Futebol', 'Natação', 'Vôlei', 'Judô', 'Atletismo', 'Ginástica'
].map(nome => ({ label: nome, value: nome }));

export const GENERO_OPCOES = [
    { label: 'todos', value: 'todos' },
    { label: 'meninas', value: 'meninas' },
    { label: 'meninos', value: 'meninos' }
];

export const SITUACAO_OPCOES = [
    { label: 'só ativas', value: 'ativas' },
    { label: 'todas', value: 'todas' }
];

export const MAIORES_FALTAS = [
    { nome: 'Judô, Pedrinhas', percentual: 47 },
    { nome: 'Ginástica, Jardim do Vale', percentual: 38 },
    { nome: 'Vôlei, Centro', percentual: 31 },
    { nome: 'Atletismo, Centro', percentual: 27 }
];
