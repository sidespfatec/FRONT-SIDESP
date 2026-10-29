# SIDESP

Sistema da Secretaria de Esportes. Esta versão reúne o frontend da `main` no commit `6018b93e0367177e2b7bc142eef64b3a3a66ddb5`, o backend de cadastro/login e os endpoints da Sprint 2.

## Executar localmente

Requisitos: Java 17, Maven 3.9+, Node 22+ e MySQL 8 ou MariaDB 10.11. Os testes desta entrega usaram MariaDB 10.11.

1. Crie um banco vazio `sidesp` com `utf8mb4`.
2. No diretório `backend`, crie `config/local.properties` usando o exemplo abaixo. Esse arquivo não entra no Git.
3. Execute `mvn spring-boot:run` em `backend`.
4. Na raiz, execute `npm ci` e `npm start`.

```properties
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/sidesp?serverTimezone=America/Sao_Paulo
spring.datasource.username=sidesp
spring.datasource.password=PREENCHER_LOCALMENTE
sidesp.cpf-key=CHAVE_BASE64_DE_32_BYTES
sidesp.email-hmac-key=OUTRA_CHAVE_BASE64_DE_32_BYTES
sidesp.email-encryption-key=OUTRA_CHAVE_BASE64_DE_32_BYTES
sidesp.jwt-key=OUTRA_CHAVE_BASE64_DE_32_BYTES
```

Gere cada chave separadamente com `openssl rand -base64 32`. Preserve as chaves usadas no banco existente: trocar as chaves de CPF ou e-mail impede localizar os cadastros antigos; trocar a chave de cifra impede ler os dados já protegidos. O Flyway aplica V1 a V4 na inicialização. Não execute os SQL da pasta `banco/explicadas`.

O frontend usa `/api/v1`; no desenvolvimento, `proxy.conf.json` encaminha para `localhost:8080`. Na produção, configure o proxy reverso para a API ou a URL de `src/environments/environment.production.ts`. GitHub Pages sozinho não hospeda o backend nem encaminha `/api`.

## Integração das telas

Consulte [INTEGRACAO-TELAS.md](documentacao/INTEGRACAO-TELAS.md) para o estado atualizado dos cadastros, perfil, dependentes e recuperação. As notas abaixo descrevem a entrega anterior da Sprint 2.

## O que estava conectado na entrega anterior

Login, cadastro público de adulto/menor e solicitação de recuperação usam a API. Guard, interceptor e filtro do menu conferem o perfil confirmado no servidor. O cadastro reaproveita os campos e a integração da versão enviada, com os estilos da `main`.

As telas administrativas da `main` continuam com seus dados de demonstração e formulários originais. Os novos services estão em `src/app/core/services`, mas os componentes administrativos ainda não os chamam. Edição de perfil, confirmação da recuperação, anamnese e cadastro autenticado de outro dependente têm endpoints/services; não receberam telas novas. Isso impede considerar todas as issues concluídas ponta a ponta. Veja [o estado de cada issue](documentacao/SPRINT2.md).

## Recuperação de senha

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_AUTH`, `SMTP_TLS` e `SMTP_FROM` no ambiente do backend. Para desenvolvimento, pode usar um servidor SMTP local na porta 1025. O código expira em 15 minutos, serve uma única vez e não é devolvido pela API. Sem SMTP disponível, o e-mail não será entregue. A fila é limitada e fica em memória; não há garantia de reenvio após reiniciar.

## Primeiro administrador

Não existe senha administrativa padrão. Cadastre uma conta comum pelo formulário e peça ao operador do banco para conferir sua identidade e promover somente essa conta:

```sql
-- Substitua 123 pelo con_id conferido pelo operador, nunca pelo pes_id.
START TRANSACTION;
UPDATE pessoas p JOIN contas c ON c.pes_id = p.pes_id
SET p.tpc_id = (SELECT tpc_id FROM tipos_cadastros WHERE tpc_des='ADMINISTRADOR_TOTAL')
WHERE c.con_id = 123;
COMMIT;
```

Saia e faça login novamente. A criação de outros administradores pela API exige um administrador total. O parcial pode gerenciar professores e a oferta, mas não administradores.

## Verificar

```bash
npm run build
npx ng test --watch=false --ts-config=tsconfig.integration.spec.json --include='src/app/core/**/*.spec.ts'
cd backend
mvn test
```

Para executar também os testes reais de HTTP/banco, configure `TEST_DB_URL` com um banco exclusivo cujo nome contenha `sidesp_test`, além de `TEST_DB_USERNAME` e `TEST_DB_PASSWORD`. A suíte limpa dados desse banco e cria/remove um segundo banco temporário para testar V3 → V4. A conta de teste precisa dessas permissões. Nunca aponte os testes para desenvolvimento ou produção.

A suíte completa de frontend (`npm test -- --watch=false`) tem imports antigos na `main` que não compilam. O teste separado acima cobre a integração entregue. Detalhes em [VALIDACAO.md](documentacao/VALIDACAO.md).

Leia [AGENTS.md](AGENTS.md) e a [documentação](documentacao/README.md) antes de alterar o projeto.
