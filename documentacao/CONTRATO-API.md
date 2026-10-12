> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

# Contrato API — implementado v0.3

Base `/api/v1`; JSON; datas ISO yyyy-MM-dd. Contrato TypeScript: frontend/src/app/core/auth/auth.models.ts. DTOs Java: backend/src/main/java/br/gov/sidesp/auth/Requests.java.

| Endpoint | Entrada/resultado |
|---|---|
| POST /auth/cadastros | Registration; 201 {id, mensagem} (id pessoa cadastrada) |
| POST /auth/login | {identificador: CPF ou e-mail, senha}; 200 {accessToken, tokenType: Bearer, expiresIn:1800, perfil, nome} |
| GET /auth/me | Authorization Bearer; 200 {id: conta, nome, perfil, dependentes:[{id:pessoa,nome}]} |
| GET /health | Público, status do serviço; não diagnostica conectividade contínua com banco |

Registration: dadosPessoais {nome,cpf,dataNascimento,genero M/F,telefone}; endereco {cep,rua,numero,complemento opcional,bairro,cidade,uf}; credenciais {email,senha,confirmacaoSenha,cpfLogin}; responsavel {nome,cpf,dataNascimento,telefone,parentesco} somente menor. Adulto: cpf obrigatório e cpfLogin próprio. Menor: cpf pode null/ausente; cpfLogin é CPF do responsável, que deve ser adulto com data obrigatória. Credenciais pertencem ao responsável. Nova criança de conta existente exige e-mail e senha atuais.

CPF: 11 dígitos ou máscara estrita, dígitos verificadores válidos e sem repetição. Unicidade no banco, um CPF por pessoa. E-mail obrigatório <=254 caracteres/bytes, normalizado lower-case/strip. Senha 8–128 pontos de código Unicode, confirmação igual, sem regra de símbolo/número e sem truncamento. Nascimento impossível/futuro inválido; idade implausível >130 anos inválida. Telefone10/11dígitos comDDD; CEP8dígitos/máscara e UF válida. O servidor nunca confia apenas na validação da tela.

Erros controlados: {codigo,mensagem,errosCampos}, com 400 inválido, 409 conflito genérico, 401 login/sessão inválidos, 403 permissão, 429 tentativas, 500 erro genérico. Nunca reproduzir senha/CPF/token no erro. Campos desconhecidos são recusados. Limites padrão20cadastros/30logins por minuto/IP. Cadastro público não permite perfil/id livre. Todos os demais endpoints são negados nesta fase.

UI consome contrato, Bearer apenas na API, login/cadastro sem token anterior. Sessão de aba e navegação dependem do perfil consultado em /me. CORS apenas localhost/127.0.0.1:4200 padrão; produção configura origem explícita.
