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
    | 'Somente leitura';

export const NIVEIS_PERMISSAO: { label: string; value: NivelPermissao }[] = [
    { label: 'Administrador geral', value: 'Administrador geral' },
    { label: 'Administrador de unidade', value: 'Administrador de unidade' },
    { label: 'Operador', value: 'Operador' },
    { label: 'Somente leitura', value: 'Somente leitura' }
];

export type ModoFicha = 'ver' | 'editar' | 'novo';
