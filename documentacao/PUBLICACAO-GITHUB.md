# Publicação para revisão — 12/10/2026

Solicitação de Heitor: criar uma branch nova e um pull request para `sidespfatec/FRONT-SIDESP`, usando as orientações de contribuicao sem publicar essa pasta.

## Organização

Angular na raiz, conforme o repositório de destino. `backend/` contém a API Spring Boot e testes; `banco/` contém as migrations e suas cópias explicadas; `documentacao/` recebe a documentação que fica em `docs/` na instalação local. `docs/` permanece com a distribuição estática já existente na main e não representa o novo build integrado. `.github/` contém o template de PR e a validação automática descritos nas orientações de contribuição.

Esta publicação não contém contribuicao, configurações/chaves locais, backups, arquivos de dados do MySQL, dependências, caches ou JARs. A migration administrativa de teste foi excluída: contém credenciais conhecidas e valores criptográficos associados às chaves da instalação local. As migrations canônicas permanecem V1–V3, sem mudanças de estrutura.

## Validação desta preparação

- Frontend: build de produção e 19 testes em seis arquivos aprovados no Windows.
- Instalação limpa com `npm ci` e build aprovados na organização Angular da raiz. A auditoria npm reportou 16 vulnerabilidades (4 moderadas, 9 altas e 3 críticas); versões preservadas nesta publicação, sem aplicar upgrades automáticos fora do escopo.
- Backend: `mvnw.cmd verify` na cópia destinada ao PR, com 35 testes aprovados, nenhum ignorado.
- Integração backend: MariaDB 10.4.32 do XAMPP, banco exclusivo `sidesp_test_pr_20261012`, chaves sintéticas próprias dos testes. O banco SIDESP não foi utilizado pela suíte.
- Compilação Java com JDK 27 e `release 17`, conforme pom.xml. O workflow valida com Java 17 e MariaDB 10.11.
- Validação HTTP local anterior: health `UP` e login fictício respondendo HTTP 401, diretamente na API e através do proxy Angular.
- Playwright não foi reexecutado nesta preparação; as evidências anteriores permanecem identificadas em VALIDACAO.md.

Avisos existentes: Leaflet CommonJS e imports RouterLink/RouterLinkActive não utilizados em NavbarDesktop. A validação GitHub Actions deve ser consultada no PR; os resultados locais não garantem antecipadamente o resultado remoto.

## Escopo e pendências

Cadastro/login, conta do responsável e sessão integrada. Relaciona-se a #1, #4, #8, #9, #10, #11 e #18 sem fechar issues parciais automaticamente. Recuperação de senha, anamnese, CRUD das demais páginas e requisitos de produção/LGPD continuam pendentes conforme PENDENCIAS.md.

Os documentos anteriores sobre ausência de acesso ao computador ou proibição de publicar descrevem entregas históricas. Esta solicitação autoriza a publicação para revisão; merge e implantação não fazem parte do pedido.
