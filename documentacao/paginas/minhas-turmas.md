> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: minhas-turmas

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #35
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/35

## Historia de usuario

Como aluno ou responsável, quero cancelar minha inscrição em uma turma, para liberar a vaga para outra pessoa.

## Criterios de aceitacao

- [ ] O cancelamento pede confirmação, explicando que a vaga será liberada.
- [ ] A vaga liberada dispara a oferta ao primeiro da lista de espera (RN010).
- [ ] A turma deixa de aparecer em minhas turmas.
- [ ] A inscrição cancelada continua registrada no histórico, com status cancelada.
- [ ] O aluno volta a poder se inscrever dentro do limite de duas modalidades (RN001).

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN001, RN010
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN001, RN010
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN001, RN010 |
| Requisito (SE) | SE009 |
| Caso de uso (UC) | UC10 |
| Tabelas do banco | Inscrição |
| Sprint Backlog v1.0 | US16 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 35 de 54 |
| Estimativa | 3 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #33, #34 |
| Destrava | #36 |

<sub>PB35 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #37
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/37

## Historia de usuario

Como aluno, quero ver as minhas turmas com horário, local e professor, para não perder aula.

## Criterios de aceitacao

- [ ] Cada turma inscrita aparece com horário, polo e professor.
- [ ] Os avisos da turma aparecem junto.
- [ ] Existe a ação de cancelar inscrição, com confirmação.
- [ ] Inscrição em lista de espera aparece separada das ativas.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN001
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN001
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN001 |
| Requisito (SE) | SE012 |
| Caso de uso (UC) | UC12 |
| Tabelas do banco | Inscrição, Turma, Professor |
| Sprint Backlog v1.0 | US20 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 37 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #33 |
| Destrava | — |

<sub>PB37 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
