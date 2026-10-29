# Contrato da API

Prefixo: `/api/v1`. JSON usa as chaves abaixo. Datas: `YYYY-MM-DD`. Requisições autenticadas usam `Authorization: Bearer TOKEN`. Campos desconhecidos são recusados. Não enviar identificador de outra conta no perfil ou no cadastro autenticado de dependente.

| Método | Caminho | Permissão | Resposta |
|---|---|---|---|
| POST | `/auth/cadastros` | Público | 201, `{id,mensagem}` |
| POST | `/auth/login` | Público | 200, `{accessToken,tokenType,expiresIn,perfil,nome}` |
| GET | `/auth/me` | Autenticado | `{id,nome,perfil,dependentes}` |
| POST | `/auth/recuperar-senha` | Público | 202, mensagem genérica |
| POST | `/auth/redefinir-senha` | Público, código válido | 204 |
| GET / PUT | `/perfil` | Próprio titular | 200 / 204 |
| POST | `/perfil/senha` | Próprio titular, senha atual | 204; exige novo login |
| GET / POST | `/admin/administradores` | Administrador total | 200 lista / 201 cadastro |
| GET / POST | `/admin/professores` | Administrador total ou parcial | 200 lista / 201 cadastro |
| PATCH | `/admin/administradores/{pesId}/situacao` | Administrador total | 204 |
| PATCH | `/admin/professores/{pesId}/situacao` | Administrador total ou parcial | 204 |
| GET / POST | `/admin/polos` | Administrador total ou parcial | 200 lista / 201 `{id}` |
| PATCH | `/admin/polos/{id}/situacao` | Administrador total ou parcial | 204 |
| GET / POST | `/admin/modalidades` | Administrador total ou parcial | 200 lista / 201 `{id}` |
| PATCH | `/admin/modalidades/{id}/situacao` | Administrador total ou parcial | 204 |
| POST | `/responsavel/dependentes` | Titular adulto autenticado | 201, `{id,mensagem}` |
| GET | `/fichas-medicas/{pesId}` | Administração ou professor vinculado | 200 ficha |
| GET | `/health` | Público | `{status: "UP"}` |

Listas retornam no máximo 200 linhas, sem paginação nesta versão. Polos aceitam `?busca=texto&ativo=true`; omitir `ativo` inclui as duas situações. Modalidades aceitam `?ativo=true`, que também exige polo ativo. PATCH de situação recebe `{ "ativo": false }`. Não existe DELETE desses registros.

## Cadastro público

```json
{
  "dadosPessoais": {
    "nome": "Pessoa de exemplo", "cpf": "CPF_VALIDO",
    "dataNascimento": "2000-01-01", "genero": "M", "telefone": "12999999999"
  },
  "endereco": {
    "cep": "12500000", "rua": "Rua de exemplo", "numero": "1", "complemento": null,
    "bairro": "Centro", "cidade": "Lorena", "uf": "SP"
  },
  "credenciais": {
    "email": "pessoa@example.invalid", "senha": "SENHA_LOCAL",
    "confirmacaoSenha": "SENHA_LOCAL", "cpfLogin": "CPF_VALIDO"
  }
}
```

Para menor, `dadosPessoais.cpf` pode ser nulo e `cpfLogin` é o do responsável. Acrescente `responsavel` com `nome`, `cpf`, `dataNascimento`, `telefone`, `parentesco`. `fichaMedica` é opcional no contrato público para compatibilidade; sua estrutura está abaixo. CPF é validado com dígitos verificadores, não com os textos ilustrativos acima.

## Profissional

POST administrativo recebe `cadastro` com o objeto anterior, além de `nivel` (somente administrador: `ADMINISTRADOR_TOTAL` ou `ADMINISTRADOR_PARCIAL`), `rg`, `registro`, `especialidade`, `cargo`, `unidade`, `admissao`. Professor exige `registro` e `especialidade`; administrador exige `nivel`. Ambos exigem cadastro adulto e endereço. A resposta id é `pes_id`, não `con_id`.

## Polo e modalidade

Polo: `{ "nome": "Polo exemplo", "endereco": { ... }, "latitude": -22.8, "longitude": -45.1 }`. O endereço segue o cadastro público. Coordenadas são obrigatórias e validadas.

Modalidade: `{ "nome": "Natação", "idadeMinima": 8, "idadeMaxima": 18, "limiteFaltasMensais": 3, "poloId": 1 }`. Idades entre zero e 130, mínimo não supera máximo, limite mensal entre zero e 31. Polo precisa estar ativo. Cadastro fica ativo por padrão.

## Dependente e ficha

POST autenticado recebe `dadosPessoais`, `endereco`, `parentesco` e `fichaMedica`. Não recebe outro titular nem credenciais.

```json
{
  "condicoes": null, "alergias": null, "medicamentos": null, "restricoes": null,
  "contatoEmergencia": "Contato de exemplo", "telefoneEmergencia": "12999999999"
}
```

Nome e telefone de emergência são obrigatórios quando há ficha; os demais campos são opcionais. Professor só lê ficha de aluno com vínculo ativo na mesma turma. Dados de saúde não aparecem nas listagens.

## Perfil e senhas

PUT perfil recebe `nome`, `nomeSocial` opcional, `email`, `telefone` e `endereco`. É uma atualização completa desses campos; CPF, nascimento e perfil de acesso não são campos editáveis nesse endpoint. GET retorna esses dados, `dataNascimento`, `genero`, `perfil`, `cpfProtegido`, `telefones` e `enderecos`.

- Troca de senha: `{ "senhaAtual": "...", "novaSenha": "...", "confirmacaoSenha": "..." }`.
- Solicitação de recuperação: `{ "identificador": "CPF ou e-mail" }`.
- Confirmação: `{ "token": "código recebido", "novaSenha": "...", "confirmacaoSenha": "..." }`.

O código expira em 15 minutos e é consumido uma única vez. A nova senha segue a regra de oito a 128 caracteres. Após sucesso, descarte a sessão local e faça novo login. Nenhuma resposta contém código, hash ou senha.

Erros: `{ "codigo": "VALIDACAO", "mensagem": "...", "errosCampos": {} }`. Status usados: 400 preenchimento/código inválido, 401 autenticação, 403 permissão/vínculo, 404 ausente, 409 duplicidade/integridade, 429 excesso de tentativas e 500 falha operacional sem detalhes internos.
