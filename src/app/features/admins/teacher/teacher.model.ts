import { DadosPessoais, Endereco } from '../registration.model';

export type { DadosPessoais, Endereco } from '../registration.model';
export { UFS, GENEROS, maiorDeIdade } from '../registration.model';

//o professor não recebe senha no cadastro: ele define a dela no primeiro acesso
export interface CadastroProfessor {
    dadosPessoais: DadosPessoais;
    endereco: Endereco;
    email: string;
}

//formato que o POST /api/v1/admin/professores recebe
export interface NovoProfessor {
    cadastro: CadastroProfessor;
    rg?: string;
    registro: string;
    especialidade: string;
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
