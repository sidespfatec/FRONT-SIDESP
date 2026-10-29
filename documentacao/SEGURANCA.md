> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Segurança — requisitos da primeira API

Origem: RN016/RN017/RN022 e issues #4/#9/#10/#11/#18/#28. Controles de autenticação implementados conforme IMPLEMENTACAO/VALIDACAO; requisitos de produção e governança continuam pendentes.

| Risco | Controle e teste |
|---|---|
| Senha vazada | Argon2id com mínimo de oito caracteres e composição livre; nunca logar segredo; hash fora dos DTOs |
| Escalada de privilégio | Cadastro ignora/rejeita perfil fornecido; perfil vem do banco; testar criação pública de admin |
| Acesso a dependente alheio | Autorizar vínculo pelo servidor; CPF sozinho não comprova tutela; testar acesso cruzado |
| Injeção SQL | JdbcTemplate/queries parametrizadas; sem concatenar entrada |
| CPF duplicado por corrida | Restrição canônica no banco; duas requisições concorrentes deixam só um cadastro |
| Enumeração de login | Resposta genérica e custo de hash equivalente quando conta inexiste; limitar tentativas |
| Token adulterado/expirado | Validar assinatura, expiração, emissor e audiência; chave via ambiente |
| Dados em logs | Mascarar identificadores, não registrar corpo completo, senha, token ou saúde |
| CORS permissivo | Lista explícita de origens configuradas; nunca wildcard de produção |
| Mass assignment | DTOs com campos permitidos; rejeitar IDs/perfis e entradas inesperadas |
| Banco exposto | Usuário mínimo, acesso local/rede privada, backup restrito; root somente se ambiente local isolado exigir |

Proposta simples: JWT Bearer de 30 minutos, sem refresh na primeira API, sujeito a P11. Sessão ao recarregar é responsabilidade de integração Angular; persistência em navegador requer avaliação de XSS. Se for escolhido cookie HttpOnly, revisar contrato, CORS com credenciais e CSRF, sem desativar CSRF por rotina.

Limitar tentativas por conta normalizada e origem sem expor a existência da conta; parâmetros configuráveis. Em instância única, contador em memória pode servir ao desenvolvimento; reinício perde limite, exigir controle durável/gateway antes de produção conforme volume. Não bloquear permanentemente contas por ataques de terceiros.

HTTPS obrigatório para tráfego com dados pessoais conforme #28. Desenvolvimento HTTP somente loopback com dados sintéticos. Não expor XAMPP/phpMyAdmin à internet. Dependências em versões suportadas, segredos fora do ZIP, erros sem stack trace pública.

Autorização futura: professor somente alunos de turmas vinculadas; administrador conforme permissão. Saúde/auditoria não serão liberadas enquanto #28 não definir acesso e retenção. Não confundir CORS ou guard Angular com autorização.

Incidente: restringir acesso, preservar evidência sem divulgar dados, avisar responsável designado pela Secretaria, avaliar obrigações legais e registrar correção/teste. Backup deve ter restauração testada antes de uso real.

## Proteção aprovada v0.2
CPF somente HMAC em documentos; senha Argon2id em contas; e-mail AES-GCM/HMAC em contas. Chaves separadas fora do banco. Sem CPF recuperável e sem criptografia reversível de senha. Senha mínima 8 caracteres; não exigir números/especiais. Consultar ADR-003 para unicidade seletiva, conta titular e uso das chaves.

O logger de avisos ErrorPacket do driverMariaDB foi limitado aERROR para não imprimir valores dosíndicesHMAC em violaçõesUNIQUE. Não habilitar logsSQL com parâmetros/dados pessoais emprodução.
