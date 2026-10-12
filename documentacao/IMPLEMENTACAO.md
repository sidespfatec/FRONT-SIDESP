> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

# Implementação efetiva v0.3 — 05/10/2026

Heitor autorizou iniciar desenvolvimento, integrar o frontend e testar. A documentação v0.2 e atualização Miro são a base. A autorização mais recente substitui o congelamento do Angular somente para autenticação e a integração necessária.

| Área | Entrega |
|---|---|
| Backend | Java 17, Spring Boot 3.5.16, Spring JDBC/Security, DTOs Bean Validation, transações e queries parametrizadas |
| Banco | 31 tabelas base preservadas + contas; três migrations Flyway, 32 tabelas de negócio |
| Cadastro | Adulto/menor; CPF, e-mail, endereço, senha, responsável adulto; rollback e unicidade sob concorrência |
| Login | CPF/e-mail, Argon2id, JWT HS256 30 min; identidade/perfil consultados no banco em cada acesso protegido |
| UI | Reactive Forms, e-mail e nascimento responsável, HTTP/proxy, sessão na aba, logout, guards e mensagens |
| Testes | JUnit API/banco real, Vitest Angular, Playwright UI conectada; detalhes em VALIDACAO.md |

Decisões técnicas: JdbcTemplate evita mapeamento ORM que altere a estrutura; Java17 mantém compatibilidade com Boot3.5. E-mail lower-case/strip antes do HMAC, cifrado AES256GCM. CPF sem pontuação antes do HMACSHA256, uma chave externa diferente da chave de e-mail. Senha 8–128 pontos de código Unicode, sem trim. JWT não contém CPF/e-mail. Tokens são armazenados em sessionStorage, protegidos pelos controles de XSS da aplicação, não por criptografia do navegador; não usar HTML arbitrário ou segredos no cliente. Nenhum perfil enviado pelo cadastro é aceito.

Nascimento do responsável agora é obrigatório na tela/API e validado >=18 anos; nullable histórico do schema não significa permissão da API. Datas impossíveis/futuras são rejeitadas; aniversário de 18 anos torna adulto na data, inclusive regra plusYears para 29/02. Fuso servidor America/Sao_Paulo; validação do servidor prevalece. Dados médicos continuam fora do contrato.

Para dependente adicional, conta existente só é vinculada após senha correta, mesmo e-mail e conta ativa. Não atualiza dados/credenciais da conta existente por requisição de cadastro. O perfil do titular previamente aluno pode continuar ALUNO com dependentes; permissão administrativa nunca é concedida por esse vínculo.

Não realizado: recuperação de senha, anamnese, CRUD das outras páginas, confirmação de e-mail, infraestrutura de produção e instalação local XAMPP. Não marcar issues integralmente concluídas quando incluírem esses itens. O Miro já recebeu as mudanças autorizadas de identidade; nenhuma tabela extra foi criada nesta implementação além de contas.
