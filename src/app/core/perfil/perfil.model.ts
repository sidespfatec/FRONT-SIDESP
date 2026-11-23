//o que o GET /api/v1/perfil devolve para qualquer perfil logado
export interface EnderecoDoPerfil {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
}

export interface PerfilDaConta {
    nome: string;
    nomeSocial: string | null;
    dataNascimento: string;   // 'aaaa-mm-dd'
    genero: 'M' | 'F';
    email: string;
    perfil: string;
    cpfProtegido: boolean;
    telefones: string[];
    enderecos: EnderecoDoPerfil[];
}

/** Corpo do PUT /api/v1/perfil: o back exige tudo junto, não só o campo alterado. */
export interface PerfilParaSalvar {
    nome: string;
    nomeSocial: string;
    email: string;
    telefone: string;
    endereco: EnderecoDoPerfil;
}

export interface TrocaDeSenha {
    senhaAtual: string;
    novaSenha: string;
    confirmacaoSenha: string;
}
