import { Cadastro } from '../registration.model';

export type { DadosPessoais, Endereco, Credenciais, Cadastro } from '../registration.model';
export { SENHA_MIN, UFS, GENEROS, maiorDeIdade } from '../registration.model';

//formato que o POST /api/v1/admin/professores recebe
export interface NovoProfessor {
    cadastro: Cadastro;
    rg?: string;
    registro?: string;
    especialidade?: string;
    cargo?: string;
    unidade?: string;
    admissao?: string;
}

export interface ProfessorCriado {
    id: number;
    mensagem: string;
}

/** O que o GET /admin/professores devolve para a listagem. */
export interface ProfessorDaLista {
    id: number;
    nome: string;
    perfil: string;
    ativo: boolean;
    registro?: string;
    especialidade?: string;
    cargo?: string;
    unidade?: string;
    admissao?: string;
}
