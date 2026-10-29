> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: turmas-professor

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #40
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/40

## Historia de usuario

Como professor, quero ver apenas as minhas turmas, para chegar rápido na aula do dia.

## Criterios de aceitacao

- [ ] A lista traz somente as turmas vinculadas ao professor (RN013).
- [ ] A aula do dia aparece em destaque.
- [ ] Cada turma mostra horário, polo, modalidade e número de alunos.
- [ ] Tentativa de acessar turma de outro professor é bloqueada no backend.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN013
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN013
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN013 |
| Requisito (SE) | SE014 |
| Caso de uso (UC) | UC18 |
| Tabelas do banco | Turma, Professor |
| Sprint Backlog v1.0 | US23 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Professor |
| Prioridade | 40 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #23 |
| Destrava | #41, #50 |

<sub>PB40 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
