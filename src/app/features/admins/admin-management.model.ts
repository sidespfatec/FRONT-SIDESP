import { Cadastro } from './registration.model';

export type NivelAcesso = 'ADMINISTRADOR_TOTAL' | 'ADMINISTRADOR_PARCIAL';

//os dois níveis que a API aceita hoje
export const NIVEIS_ACESSO: { label: string; value: NivelAcesso }[] = [
    { label: 'Acesso total', value: 'ADMINISTRADOR_TOTAL' },
    { label: 'Acesso parcial', value: 'ADMINISTRADOR_PARCIAL' }
];

//formato que o POST /api/v1/admin/administradores recebe
export interface NovoAdministrador {
    cadastro: Cadastro;
    nivel: NivelAcesso;
    rg?: string;
    cargo?: string;
    unidade?: string;
    admissao?: string;
}

export interface AdministradorCriado {
    id: number;
    mensagem: string;
}

/** O que o GET /admin/administradores devolve para a listagem. */
export interface AdministradorDaLista {
    id: number;
    nome: string;
    perfil: NivelAcesso;
    ativo: boolean;
    cargo?: string;
    unidade?: string;
    admissao?: string;
}
