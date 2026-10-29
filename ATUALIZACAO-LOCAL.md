# Atualização local — 12/10/2026

Aplicada em `E:\Programação\SIDESP\SIDESP` a partir de `C:\Users\heito\Downloads\FRONT-SIDESP-main.zip`.

## Frontend

Todos os SCSS, imagens e ícone do ZIP foram sincronizados. O visual das demais páginas já correspondia ao anexo. Login e cadastro usam os estilos do ZIP acrescidos de mensagens de erro, mantendo os formulários conectados à API, validação, sessão e autorização. O ZIP original tem login demonstrativo que apenas navega para a home; esse comportamento não foi reintroduzido. Corrigidos textos do login e explicitado `/api/**` no proxy Angular.

Backup anterior: `frontend-backup-20261012-183809/`.

## Backend e banco local

O MariaDB do XAMPP escutava em 3306, mas não completava o handshake. A pasta `E:\Xampp\mysql\data\mysql` estava ausente. Após parar o processo, foi feita uma cópia completa de `data` em `mysql-backup-20261012-185200/` e restaurada somente a pasta interna `mysql` a partir de `E:\Xampp\mysql\backup\mysql`. Os bancos de aplicação foram preservados. As contas internas do MariaDB vêm dessa cópia do XAMPP.

O banco SIDESP tinha as migrations aplicadas manualmente, sem `flyway_schema_history`. Foi criada uma referência separada com V1–V3 e comparadas as definições das 32 tabelas, quatro triggers e os quatro catálogos. A comparação desconsiderou somente os contadores AUTO_INCREMENT, espaços e configurações de sessão de charset no dump. Com a estrutura equivalente, foi registrada uma baseline versão 3, uma única vez. O padrão `baseline-on-migrate: false` continua no projeto. Não foram recriadas tabelas SIDESP, alteradas chaves da aplicação ou removida a conta existente.

## Validação

- Build Angular concluído, com aviso já existente de CommonJS no Leaflet.
- 19 testes Angular passaram em seis arquivos.
- API `/api/v1/health`: `UP` diretamente na porta 8080 e via frontend na porta 4200.
- Login com credenciais fictícias: HTTP 401 e mensagem de credenciais inválidas pelos dois caminhos, confirmando comunicação com o backend.
- Uma conta preservada. Não foi realizado login com a senha pessoal do usuário.
- Script PowerShell de inicialização validado sintaticamente.

## Iniciar nas próximas vezes

No repositório GitHub, ligue o MySQL no XAMPP, configure a conexão conforme README.md e execute na pasta backend:

```powershell
.\mvnw.cmd clean package
java -jar target/sidesp-backend-0.1.0.jar
```

Em outro terminal, na raiz Angular do repositório, execute `npm.cmd ci` e `npm.cmd start`. Abra `http://localhost:4200/login`. O script de inicialização citado na validação existia na instalação local durante aquela verificação e não integra esta publicação. As notas antigas de README-ATUALIZACAO.md sobre uma entrega não aplicada referem-se ao pacote anterior.
