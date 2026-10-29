export interface Registration {
 dadosPessoais: {nome:string; cpf:string|null; dataNascimento:string; genero:string; telefone:string};
 endereco: {cep:string; rua:string; numero:string; complemento:string|null; bairro:string; cidade:string; uf:string};
 credenciais: {email:string; senha:string; confirmacaoSenha:string; cpfLogin:string};
 responsavel?: {nome:string; cpf:string; dataNascimento:string; telefone:string; parentesco:string};
}
export type Perfil = 'ALUNO'|'RESPONSAVEL'|'PROFESSOR'|'ADMINISTRADOR_TOTAL'|'ADMINISTRADOR_PARCIAL';
export interface LoginResult {accessToken:string; tokenType:string; expiresIn:number; perfil:Perfil; nome:string}
export interface Me {id:number; nome:string; perfil:Perfil; dependentes:{id:number; nome:string}[]}
export interface ApiError {codigo:string; mensagem:string; errosCampos:Record<string,string>}
