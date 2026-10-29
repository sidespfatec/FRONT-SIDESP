> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: gerenciar-inscricoes

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #39
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/39

## Historia de usuario

Como administrador, quero gerenciar inscrições e a fila de espera, para resolver os casos do dia a dia da Secretaria.

## Criterios de aceitacao

- [ ] Lista de inscrições por turma, com a situação de cada uma.
- [ ] É possível puxar um aluno da lista de espera para a vaga (UC29).
- [ ] É possível criar ou cancelar inscrição fora da regra, com justificativa obrigatória (RN023).
- [ ] Toda ação fica registrada com autor, data e motivo.
- [ ] A ordem da fila pode ser conferida e corrigida.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN023
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN023
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN023 |
| Requisito (SE) | SE024 |
| Caso de uso (UC) | UC29, UC31 |
| Tabelas do banco | Inscrição, Aluno, Turma |
| Sprint Backlog v1.0 | US32 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 39 de 54 |
| Estimativa | 8 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #29, #34, #36 |
| Destrava | #49 |

<sub>PB39 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
