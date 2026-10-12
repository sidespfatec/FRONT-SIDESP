# SIDESP — frontend e autenticação

Angular permanece na raiz deste repositório. Backend Java 17/Spring Boot está em backend/, migrations em banco/ e documentação em documentacao/. Base preservada: main 2046d3764142a80c38dd7073058a67c236adab1f.

## Executar

1. Crie banco vazio sidesp com banco/00_criar_banco.sql no XAMPP. Não importe migrations manualmente.
2. Na pasta backend, execute `powershell -ExecutionPolicy Bypass -File scripts/configurar-local.ps1`. Informe URL JDBC MySQL ou MariaDB conforme versão/porta local. Preserve as chaves existentes em config/local.properties se já usa o banco.
3. Na pasta backend: `.\mvnw.cmd clean package` (Linux: `./mvnw clean package`), depois `java -jar target/sidesp-backend-0.1.0.jar`.
4. Na raiz Angular: `npm ci`, depois `npm start`. No PowerShell com bloqueio de scripts, use `npm.cmd ci` e `npm.cmd start`. Acesse http://localhost:4200/registration e /login. API http://localhost:8080/api/v1/health.

Git não distribui JAR nem segredos. O JAR do pacote de instalação e o código do repositório têm a mesma origem; qualquer nova alteração exige recompilar.

## Testes e escopo

Na raiz: `npm test -- --watch=false` e `npm run build`. Backend: comandos/variáveis em documentacao/PLANO-DE-TESTES.md. Navegador: API/Angular em banco isolado, `npx playwright install chromium` e `npm run test:e2e`.

Cadastro/login e conta do responsável estão implementados. CPF válido/único somente HMAC em documentos; senha Argon2id mínimo 8 caracteres; e-mail obrigatório AES-GCM/HMAC; responsável adulto para menor; nascimento futuro recusado. JWT30min/perfil atual do banco. Não há CRUD das demais páginas, recuperação de senha, anamnese, confirmação de e-mail ou implantação de produção nesta versão. Consulte documentacao/PENDENCIAS.md.

Abra uma branch e um pull request para main. Esta entrega não fecha issues automaticamente. Consulte documentacao/PUBLICACAO-GITHUB.md para o escopo e a validação desta publicação. A pasta contribuicao e os arquivos locais de credenciais, dependências e backups não são distribuídos. A conta administrativa de teste depende de chaves locais e não integra as migrations canônicas V1–V3.
