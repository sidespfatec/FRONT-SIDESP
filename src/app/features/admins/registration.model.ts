//bloco de cadastro que os endpoints de professor e de administrador compartilham
export interface DadosPessoais {
    nome: string;
    cpf: string;
    dataNascimento: string;   // 'aaaa-mm-dd'
    genero: 'M' | 'F';
    telefone: string;
}

export interface Endereco {
    cep: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
}

export interface Credenciais {
    email: string;
    senha: string;
    confirmacaoSenha: string;
    cpfLogin: string;
}

export interface Cadastro {
    dadosPessoais: DadosPessoais;
    endereco: Endereco;
    credenciais: Credenciais;
}

//a senha tem de 8 a 128 caracteres
export const SENHA_MIN = 8;

export const UFS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const GENEROS = [
    { label: 'Feminino', value: 'F' },
    { label: 'Masculino', value: 'M' }
];

/** A API recusa profissional menor de idade. */
export function maiorDeIdade(nascimento: string): boolean {
    if (!nascimento) { return false; }
    const [ano, mes, dia] = nascimento.split('-').map(Number);
    return new Date(ano + 18, mes - 1, dia) <= new Date();
}
