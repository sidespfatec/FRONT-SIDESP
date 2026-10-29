# Validação v0.4 — 12/10/2026

> Execução local atual para publicação: 35 testes backend aprovados, nenhum ignorado, em MariaDB 10.4.32/XAMPP com banco isolado; build Angular e 19 testes aprovados no Windows. Consulte PUBLICACAO-GITHUB.md. Os registros de Linux/MariaDB 10.11 e ausência de acesso ao computador abaixo descrevem a validação histórica do pacote.

| Verificação executada | Resultado |
|---|---|
| JUnit RulesTest | 18 testes aprovados |
| JUnit CryptoCompatibilityTest | 3 testes aprovados |
| JUnit AuthIntegrationTest, SpringHTTP + MariaDB10.11.14 isolado | 14 testes aprovados, nenhum ignorado nesta execução |
| Angular/Vitest | 19 testes aprovados em6arquivos |
| Playwright, Angular/API/banco dedicados, Chromium141 | 5 fluxos aprovados |
| Maven package e JAR executado | Sucesso |
| Angular produção | Sucesso; aviso Leaflet CommonJS preexistente |
| Cobertura de comentários em Java por análise sintática | 124 métodos/construtores explícitos, todos com Javadoc, incluindo classes anônimas e testes |
| V1/V2/V3 comparadas aoZIPv0.3 | Byteporbyte iguais; cópias de estudo removendo comentários recuperam o original exato |
| SQL explicado | 329+25+38=392 linhas explicadas, inclusive separações/comentários originais |
| ScriptsPowerShell | Sintaxe validada emPowerShell7.5; lógica de atualização testada em cópia simulada com backup/chaves/Git/caches preservados |
| PreparaçãoGit | Clone real de main + branch local feat/autenticacao-sidesp; Angular na raiz e exclusão de segredos/JAR confirmadas; sem push/PR |

**Total:59 testes automatizados aprovados (35backend+19Angular+5navegador).** O teste de navegador verifica360/768/1280px, navegação por Tab e ausência de exceções de página no login. Demais fluxos: cadastro adulto/menor, CPF/e-maillogin, senha7recusada/8aceita, duplicidade, recarga/sair, CPF inválido, nascimento futuro, responsável obrigatório/adulto, conta do responsável com dependente visível e rotasadministrativas semlogin.

API/banco exercitam unicidade CPF/e-mail, concorrência, rollback, conta existente com senha correta, inatividade, token adulterado/expirado, perfil arbitrário rejeitado, dados protegidos e um CPF por pessoa com múltiplos RG permitidos. Novos testes confirmam HMAC do CPF compatível com formato antigo, envelope AES-GCMv1 decifrável com nonce novo, chaves curtas/repetidas recusadas, campo correto no erro de nascimento do responsável e reabertura dajanela por IP após60s.

Como reexecutar: README/CONTRIBUTING. SemTEST_DB_URL contendo sidesp_test, os14testes debanco são ignorados. Os testes de integração apagam registros exclusivamente nesse banco separado; não usar dados reais. Testes na mesma instalação XAMPP/computador de Heitor, duas máquinas da equipe, MySQL8 e execução doworkflow GitHub ainda não foram realizados. Windows nativo/robocopy não foi executado: sintaxePowerShell e comportamento de cópia foram exercitados em Linux com substituto de cópia, usando parâmetros reais. Não confundir essa evidência com atualização no E:.

Frontend anexado:137 arquivos idênticos àbase 2046d37 e main remoto consultado; integração funcional mantida e hydrationSSR removida do buildCSR para evitar aviso desnecessário. Snapshot/manifesto em fontes/comparacao-frontend-v0.4.json. Banco não mudou de estrutura:32 tabelas de negócio/43 relações, mais flyway_schema_history. NenhumaV4 foi necessária.

Evidências textuais em evidencias/; fontes das issues atuais em fontes/revisao-2026-10-12-*.json. Não houve alteração deissue, push ou PR.
