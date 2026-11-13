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
    mes: 'Ainda não há dados disponíveis para este período.',
    polo: 'Ordenado do maior para o menor.',
    modalidade: 'Ordenado do maior para o menor.',
    idade: 'Faixas na ordem de idade.'
};

export const DADOS: Record<Eixo, SerieComparada> = {mes:{rotulos:[],total:[],meninas:[],meninos:[],ordenar:false,horizontal:false},polo:{rotulos:[],total:[],meninas:[],meninos:[],ordenar:false,horizontal:false},modalidade:{rotulos:[],total:[],meninas:[],meninos:[],ordenar:false,horizontal:false},idade:{rotulos:[],total:[],meninas:[],meninos:[],ordenar:false,horizontal:false}};

export const POLOS_OPCOES = [] as {label: string; value: string}[];

export const MODALIDADES_OPCOES = [] as {label: string; value: string}[];

export const GENERO_OPCOES = [
    { label: 'todos', value: 'todos' },
    { label: 'meninas', value: 'meninas' },
    { label: 'meninos', value: 'meninos' }
];

export const SITUACAO_OPCOES = [
    { label: 'só ativas', value: 'ativas' },
    { label: 'todas', value: 'todas' }
];

export const MAIORES_FALTAS = [] as {nome: string; percentual: number}[];
