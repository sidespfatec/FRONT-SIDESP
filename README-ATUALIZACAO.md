# Atualizar o projeto instalado — v0.4

> Registro histórico do pacote anterior. A atualização local foi aplicada em 12/10/2026, conforme ATUALIZACAO-LOCAL.md. Neste repositório, Angular fica na raiz e a documentação em documentacao/. Os scripts de atualização/contribuição citados abaixo não fazem parte desta publicação; para instalar a partir do código, siga README.md.

O ambiente que gerou esta entrega não acessa o disco E: do computador de Heitor. Os arquivos foram atualizados e testados aqui; o script abaixo aplica a cópia localmente, com backup. Não foi aplicado no computador do usuário.

## Aplicar em E:\Programação\SIDESP\SIDESP

1. Pare backend e frontend com Ctrl+C nos terminais. Extraia este ZIP em OUTRAPASTA, fora da instalação atual (ex.: Downloads/SIDESP-v0.4).
2. Abra Power Shell dentro da pasta SIDESP extraída e execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Atualizar-Projeto.ps1 -Destino 'E:\Programação\SIDESP\SIDESP'
```

O script primeiro cria SIDESP-backup-AAAAMMDD-HHMMSS ao lado da instalação; inclui configuração/chaves. Depois copia o pacote sem apagar arquivos desconhecidos, sem substituirbackend/config/local.properties ou .env, sem copiar.git, caches ou dependências. Banco não é alterado pelo atualizador. Não compartilhe o backup, pois ele guarda segredos locais. Em falha de cópia, consulte/restaure a versão do backup antes de iniciar.

3. Na instalação atualizada, backend: `java -jar bin/sidesp-backend.jar`. Em outroterminal, frontend: `npm ci` e `npm start`. XAMPP/My SQL deve continuar ligado. Não gere novas chaves e não reimporte migrations. Quem já aplicou V1–V3 continua usando o mesmo banco.

## Preparar contribuição no Git Hub

Na pasta do pacote, execute:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Preparar-Contribuicao.ps1
```

Cria clone NOVO em E:\Programação\SIDESP\FRONT-SIDESP-contribuicao, branch feat/autenticacao-sidesp, com Angular na RAIZ conforme Git Hub. backend/banco/documentacao ficam ao lado. A conta conectada tinha permissão push em12/10; não precisa ser dona do repositório para abrir PR. Conta sem push deve usarfork e fornecer-ForkUrl. O script não fazcommit/push/PR e interrompe se main tiver mudado desde a base analisada.

Siga contribuicao/CONTRIBUTING.md (pasta real: contribuicao) para testar/commit/push. Há título/descrição sugeridos e workflow CI. A cópia Git não inclui config/chaves, JAR, caches ou backup. Confira sempre o diff antes de enviar. Opcional: alteracoes.patch é umdiff do pacote para aplicar na base 2046d37; não aplicar também após copiar com o script.

## O que mudou

- Anexo FRONT-SIDESP-main.zip:137 arquivos idênticos ao commit usado antes: 2046d37. A entrega preserva o anexo como base e a integração já feita; não regride cadastro/login para formulários sem API.
- Backend refatorado para leitura: funções menores, nomes explícitos, if/for simples, Javadoc em todos os métodos/construtores explícitos, incluindo testes.
- Segurança preservada: CPF HMAC, e-mail AES-GCM/HMAC, Argon2id, JWT, SQL parametrizado, transações e autorização do servidor.
- Migrations executáveis V1–V3 byte por byte iguais;392 linhas explicadas nas cópias banco/explicadas. Não há V4 nem mudança de estrutura sem necessidade.
- Scripts de atualização/contribuição, documentação didática e revisão das issues atuais.

Consulte docs/VALIDACAO.md para resultados e limites: validação no Linux/Maria DB, sintaxe Power Shell e cópia simulada; não representa execução nativa no Windows de Heitor nem CI já executada no Git Hub.
