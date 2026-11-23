export interface Administrador {
    id: number;
    nome: string;
    cpf: string;
    rg?: string;
    nascimento: Date | null;
    email: string;
    telefone: string;
    cidade: string;
    nivel: NivelPermissao;
    cargo: string;
    unidade: string;
    admissao: Date | null;
    doisFatores: boolean;
    ativo: boolean;
    cadastradoPor?: string;
}

export type NivelPermissao =
    | 'Administrador geral'
    | 'Administrador de unidade'
    | 'Operador'
    | 'Somente leitura'
    | 'Acesso total'
    | 'Acesso parcial';

export const NIVEIS_PERMISSAO: { label: string; value: NivelPermissao }[] = [
    { label: 'Administrador geral', value: 'Administrador geral' },
    { label: 'Administrador de unidade', value: 'Administrador de unidade' },
    { label: 'Operador', value: 'Operador' },
    { label: 'Somente leitura', value: 'Somente leitura' }
];

export type ModoFicha = 'ver' | 'editar' | 'novo';


export const Perfil_provisorio: Administrador = {
    id: 1,
    nome: 'Josiane Blanco',
    cpf: '000.000.000-00',
    rg: '00.000.000-0',
    nascimento: new Date(1996, 2, 4),
    email: 'josiane.blanco@gmail.com',
    telefone: '11959351068',
    cidade: 'Guaratinguetá',
    nivel: 'Administrador geral',
    cargo: 'Administrador',
    unidade: 'Guaratinguetá',
    admissao: new Date(2023, 8, 30),
    doisFatores: true,
    ativo: true,
    cadastradoPor: 'Paulo Rodrigues'
}

export function dataLocal(iso: string): Date {
    const [ano, mes, dia] = iso.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
}