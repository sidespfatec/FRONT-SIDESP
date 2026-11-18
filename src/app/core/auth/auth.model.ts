export type Perfil =
    | 'ADMINISTRADOR_TOTAL'
    | 'ADMINISTRADOR_PARCIAL'
    | 'PROFESSOR'
    | 'ALUNO'
    | 'RESPONSAVEL';


/** O que vai no corpo do POST /auth/login. */
export interface Credenciais {
    identificador: string;   // CPF ou e-mail
    senha: string;
}


/** O que o back devolve quando o login dá certo. */
export interface RespostaLogin {
    accessToken: string;   // o JWT
    tokenType: string;     // 'Bearer'
    expiresIn: number;     // segundos de validade (hoje: 1800 = 30 min)
    perfil: Perfil;
    nome: string;
}


/** Um dependente vinculado a um responsável. */
export interface Dependente {
    id: number;
    nome: string;
}


/** O que o GET /auth/me devolve. */
export interface Me {
    id: number;
    nome: string;
    perfil: Perfil;
    dependentes: Dependente[];
}
