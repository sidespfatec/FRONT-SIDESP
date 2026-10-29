> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: chamada-diario

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #41
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/41

## Historia de usuario

Como professor, quero registrar presença, falta e o conteúdo da aula em uma única tela, para não repetir o mesmo lançamento em vários lugares.

## Criterios de aceitacao

- [ ] A lista de alunos da turma permite marcar presente ou ausente, com ação de marcar todos presentes.
- [ ] O conteúdo da aula é obrigatório antes de salvar (RN014), e as observações são opcionais.
- [ ] O registro é único e alimenta relatórios e controle de faltas.
- [ ] A chamada salva não pode ser alterada pelo professor (RN019).
- [ ] Falha de conexão avisa e não perde o que já foi marcado.
- [ ] Confirmação clara depois de salvar.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN014, RN019
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN014, RN019
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN014, RN019 |
| Requisito (SE) | SE015, SE016 |
| Caso de uso (UC) | UC19, UC20 |
| Tabelas do banco | Chamada, Presença, Turma, Professor |
| Sprint Backlog v1.0 | US24 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Professor |
| Prioridade | 41 de 54 |
| Estimativa | 13 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #5, #40 |
| Destrava | #42, #43, #44 |

<sub>PB41 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #43
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/43

## Historia de usuario

Como administrador, quero corrigir uma chamada já salva com justificativa, para resolver erro de lançamento sem abrir a edição para o professor.

## Criterios de aceitacao

- [ ] Somente o administrador altera chamada salva (RN019).
- [ ] A justificativa da correção é obrigatória.
- [ ] O histórico guarda autor, data e o valor anterior.
- [ ] A correção recalcula as faltas do aluno.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN019
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN019
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN019 |
| Requisito (SE) | SE015 |
| Caso de uso (UC) | UC19 |
| Tabelas do banco | Chamada, Presença |
| Sprint Backlog v1.0 | US26 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 43 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #5, #41 |
| Destrava | — |

<sub>PB43 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
