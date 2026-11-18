export interface PerfilProfessor {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;   // vem como texto: '1988-07-04'
    telefone: string;
    registroProfissional: string;
    especialidade: string;
}


export interface TurmaDoProfessor {
    id: number;
    modalidade: string;       // 'Natação'
    nome: string;             // 'Infantil A'
    polo: string;             // 'Polo Centro'
    diasSemana: number[];     // [2, 4] = terça e quinta (0 = domingo)
    horaInicio: string;       // '14:00'
    horaFim: string;          // '15:00'
    totalAlunos: number;
    vagas: number;
}

export interface AlunoDaTurma {
    id: number;
    nome: string;
    idade: number;
    frequencia: number;       // 0 a 100
    faltasSeguidas: number;
    responsavel: string;
    parentesco: string;       // 'Mãe', 'Pai', 'Avó'
    telefone: string;
}

const DIAS_CURTOS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function rotuloDias(dias: number[]): string {
    // map troca cada número pelo nome: [2,4] -> ['Ter','Qui']
    const nomes = dias.map(dia => DIAS_CURTOS[dia]);

    if (nomes.length <= 1) {
        return nomes.join('');
    }

    // slice(0, -1) = todos menos o último. Assim sai 'Ter, Qua e Qui'
    // em vez de 'Ter, Qua, Qui'.
    return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}


// 'PENDENTE' | 'SALVA' é um tipo união: a variável só aceita um desses dois
export type SituacaoAula = 'PENDENTE' | 'SALVA' | 'CANCELADA';

export type Presenca = 'PRESENTE' | 'FALTA' | 'JUSTIFICADA';

export interface Aula {
    id: number;
    turmaId: number;
    data: string;             // 'aaaa-mm-dd'
    situacao: SituacaoAula;
}

export interface RegistroDeAula {
    aulaId: number;
    conteudo: string;         // o que foi dado na aula
    ocorrencia?: string;      // o '?' = pode não vir
}

// DATAS

const DIAS_LONGOS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

export function dataLocal(iso: string): Date {
    return new Date(`${iso}T00:00:00`);
}

/** '2026-11-17' -> 'Ter' */
export function diaCurto(iso: string): string {
    return DIAS_CURTOS[dataLocal(iso).getDay()];
}

/** '2026-11-17' -> 'terça' */
export function diaPorExtenso(iso: string): string {
    return DIAS_LONGOS[dataLocal(iso).getDay()];
}

/** '2026-11-17' -> '17/11' */
export function diaMes(iso: string): string {
    const d = dataLocal(iso);
    // padStart(2, '0') põe o zero na frente: 7 vira '07'
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');   // mês começa em 0!
    return `${dia}/${mes}`;
}

export function ehHoje(iso: string): boolean {
    const hoje = new Date();
    const d = dataLocal(iso);

    // Comparar os três pedaços, não o Date inteiro: dois Date do mesmo dia
    // mas de horas diferentes nunca são iguais.
    return d.getDate() === hoje.getDate()
        && d.getMonth() === hoje.getMonth()
        && d.getFullYear() === hoje.getFullYear();
}