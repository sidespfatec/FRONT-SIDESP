> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Plano de testes e evidências
Estado: planejado; testes ainda não executados, pois nenhum backend foi criado.

| Cenário | Evidência esperada | Fonte |
|---|---|---|
| Adulto válido | 201, persistência e login imediatamente possíveis | #11 |
| CPF duplicado simultâneo | Um sucesso, um 409; nenhuma duplicação | RN016 |
| Senhas divergentes/limite bytes | 400; nenhum registro salvo | #11 |
| Hoje completa 18 / amanhã completa 18 | Titularidade correta sem armazenar idade | #11/#18 |
| Nascimento futuro/data impossível | 400 | Validação |
| Falha em contato/endereço | Rollback integral cadastro | Integridade |
| CPF/e-mail válido com senha certa | Token do perfil do banco | #9 |
| Senha errada/inexistente/inativo | Mesmo 401 genérico | #9 |
| Token alterado/expirado/ausente | Acesso recusado | RN017 |
| Perfil público manipulado | Nunca cria administrador/professor | RN017/RN022 |
| Responsável existente/outro dependente | Exige vínculo autorizado, sem sequestro de conta | #18 |
| Migration do zero e segunda inicialização | Estrutura correta, sem reaplicação/duplicar catálogos | #1 |
| Migration nova sobre anterior | Preserva dados e estrutura não alterada | #1 |
| ZIP frontend | Checksums iguais ao snapshot completo | Usuário |

Usar testes service/security e integração no motor MySQL/MariaDB confirmado, sem substituir por H2 como evidência de compatibilidade SQL. Dados somente sintéticos. Cobertura RN001–RN025 de #48 é projeto futuro; não marcar todas com testes de login.

Roteiro manual futuro: criar banco isolado, configurar ambiente, rodar migrations/backend, cadastrar adulto por cliente HTTP, autenticar, tentar acesso proibido; confirmar recuperação via backup. QA registra resultados; duas máquinas reais da equipe devem validar #1. Teste de interface ponta a ponta bloqueado por frontend sem chamadas e proibição de editá-lo.

## Testes adicionais v0.2
Senha com 8 letras aceita e 7 recusada, Unicode corretamente contado; CPF hash sem texto legível; dois CPFs distintos da mesma pessoa recusados; CPF igual de pessoas distintas recusado; RGs não indevidamente limitados; trigger exige tipo CPF/hash; e-mail ausente recusado e e-mail cifrado/hash consistente; conta titular única; res_cpf/res_idade ausentes na revisão; restrições verificadas em concorrência.
