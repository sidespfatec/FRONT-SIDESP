# Como ler o backend Spring Boot

Ordem sugerida: SidespApplication → Requests → AuthController → Rules → AuthService → AuthRepository → SecurityConfig → Crypto/TokenService → testes. Todos os métodos e construtores escritos têm Javadoc. Records geram automaticamente construtor/acessores; suas declarações explicam a finalidade, sem escrever getters/setters desnecessários.

| Arquivo | Papel |
|---|---|
| SidespApplication | Inicia Spring e define relógio de negócio |
| Requests | Dados JSON permitidos; @NotBlank/@Size/@Valid recusam entradas incompletas |
| AuthController | Recebe HTTP, limita tentativas e chama serviço |
| Rules | Valida CPF, senha, nascimento, telefone e endereço sem consultar banco |
| AuthService | Decide adulto/menor, titular da conta e vínculo; @Transactional desfaz cadastro inteiro se falhar |
| AuthRepository | Executa SQL com ? e parâmetros; JdbcTemplate participa da transação |
| ApiException/ApiErrors | Transformam falhas em HTTP400/409/401/500 sem valores sensíveis |
| SecurityConfig | Define público/protegido, validaJWT e consulta perfil/atividade no banco |
| Crypto | HMAC do CPF/e-mail e cifraAES-GCM; usa bibliotecas padrão, não criptografia caseira |
| TokenService | Emite sessãoJWT válida30min após autenticação |
| AttemptLimiter | Contador por IP em memória por60segundos; não é controle distribuído de produção |

## Entender o cadastro

register valida dados comuns e escolhe registerAdult ou registerMinor. Adulto precisaCPF e cria conta própria. Menor exige responsável adulto; ensureGuardian cria sua conta ou prova posse da conta existente usando senha+e-mail corretos. O aluno menor é vinculado por responsaveis_dependentes, sem conta separada. Contatos e endereço terminam a mesma transação. ÍndicesUNIQUE protegem CPF/e-mail mesmo quando duas requisições chegam juntas.

NoRepository, cada consulta tem tabela fixa e parâmetros. registrationType consulta somente tipos_cadastros; a função anterior que concatenava nomes de tabela foi removida. mapAccount usa nomes de colunas. Não adicionar valores do cliente ao SQL com concatenação.

## Entender o login

findLoginAccount calcula ohash do CPF/e-mail normalizado e procura a conta. Oencoder compara senha com Argon2id. Conta inexistente passa por hash fictício para evitar uma resposta barata distinguível. Conta inativa/senha errada/inexistente produzem a mesma mensagem. TokenService assinaJWT; cada GET protegido valida assinatura/datas/emissor/audiência e consulta o banco, sem confiar emperfil alterado no navegador.

A criptografia tem etapas que não devem ser removidas para simplificar: nonce aleatório, autenticaçãoGCM, chaves distintas, salt Argon2 e validadorJWT. Os comentários explicam cada operação. “Mais simples” significa código legível, não senha/CPF em texto puro nem permissões só noAngular.

## Estudar o banco

Migrations SQL não têm métodos Java; criam tabelas, chaves, índices e triggers. banco/explicadas contém a mesma instrução original com comentário antes de cada linha. Não executar esses arquivos. O Flyway usa originais imutáveis; nova estrutura futura recebe V4 etc. Nesta entrega não houve alteração estrutural do banco.

## Alterar sem quebrar

Leia CONTEXTO/AGENTS/issue da página. Mude uma regra por vez e rode seus testes. Nunca normalize/trunque senha, altere prefixo/formato do HMAC ou regenere chaves de banco existente. Consulte VALIDACAO/README para rodar testes de integração em sidesp_test separado. Não comece CRUD de outras páginas, saúde, recuperação de senha ou admin público sem escopo aprovado.
