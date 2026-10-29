# Backend

A API usa Spring Boot, JDBC e Flyway. Controller recebe HTTP; Service valida as regras e delimita as transações; Repository guarda SQL reutilizado pelo cadastro e pela autenticação. Os cadastros da Sprint 2 usam `JdbcTemplate` no serviço para manter consultas pequenas e visíveis, sem criar camadas que só repassam chamadas.

| Código | Responsabilidade |
|---|---|
| `auth/AuthController`, `AuthService`, `AuthRepository` | Cadastro público, login e identidade |
| `auth/AccountController`, `AccountService` | Perfil do titular e troca de senha |
| `auth/RecoveryService`, `RecoveryConfig` | Código por e-mail e fila limitada de envio |
| `management/ManagementController`, `ManagementService` | Administradores, professores, polos, modalidades e dependentes |
| `management/MedicalRepository` | Escrita cifrada da ficha médica |
| `security/SecurityConfig` | JWT, situação da conta, versão de senha, permissões HTTP e CORS |
| `security/Crypto`, `TokenService` | HMAC, AES-GCM e emissão do token |
| `auth/Rules`, `ApiErrors` | Validações e respostas de erro |

## Cadastro

Adulto tem conta própria. Menor fica vinculado ao responsável adulto; não recebe outra conta de acesso. O cadastro público permite reutilizar a conta do responsável somente após conferir e-mail e senha. `POST /responsavel/dependentes` usa o titular já autenticado e dispensa reenviar suas credenciais.

CPF fica como HMAC em `documentos`; senha usa Argon2id; e-mail é cifrado e possui índice HMAC. O CPF não pode ser reconstruído para exibição. O perfil retorna `cpfProtegido=true` e não aceita modificar CPF.

O cadastro de profissional reaproveita a validação do cadastro adulto dentro de uma transação, atribui o perfil permitido pelo endpoint e grava os dados profissionais. Não há conta administrativa padrão. O README explica o primeiro acesso administrativo.

## Senha e sessão

JWT dura 30 minutos. Em cada chamada, o servidor consulta perfil e atividade atuais. `con_versao` também precisa coincidir com a versão do token. Trocar/redefinir senha incrementa essa versão e encerra o uso dos tokens anteriores. Sair no navegador apenas remove a sessão local.

Recuperação gera 32 bytes aleatórios, envia o código por SMTP e guarda somente SHA-256 dele. A conta fica travada durante o consumo para impedir reutilização simultânea. Links pendentes também são invalidados ao trocar e-mail ou senha. Conta inexistente, inativa ou identificador inválido recebe o mesmo retorno público. Falhas SMTP são registradas sem destinatário ou token; a fila não é persistente.

## Banco

V1 a V3 foram preservadas. V4 adiciona os campos e tabelas da Sprint 2 e remove redundâncias do responsável depois de preservar a data na pessoa vinculada. Veja [DICIONARIO-V4.md](banco/DICIONARIO-V4.md) e [MODELO-ATUAL.mmd](banco/MODELO-ATUAL.mmd).

Não altere migrations aplicadas. O teste de atualização cria uma base V3, insere dados legados, aplica V4 e confere a preservação. Antes de aplicar em dados reais, faça backup e verifique se há fichas médicas duplicadas por pessoa: a nova chave única rejeita a atualização nesse caso, sem descartar fichas automaticamente.

## Segurança

Permissões não dependem do menu. Rotas administrativas, ficha médica e titularidade são verificadas no servidor. SQL recebe parâmetros; nomes de tabela não vêm das requisições. Os dados médicos usam AES-GCM com contexto separado do e-mail. A chave de cifra precisa ficar fora do repositório e ser preservada com o backup do ambiente.

Os limites de requisição e a fila de e-mail são locais à instância. CORS aceita somente origens configuradas, sem cookies. Configure TLS, credenciais SMTP e o proxy do frontend no ambiente real.
