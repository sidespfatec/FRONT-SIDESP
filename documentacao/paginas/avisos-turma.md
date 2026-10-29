> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: avisos-turma

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #50
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/50

## Historia de usuario

Como professor, quero avisar a minha turma sobre mudanças, para que ninguém vá ao polo em vão.

## Criterios de aceitacao

- [ ] Escolha da turma e escrita do aviso em uma tela.
- [ ] O aviso aparece na área do aluno e no histórico da turma.
- [ ] Aviso de cancelamento ou mudança de local é marcado como urgente e disparado imediatamente (RN020).
- [ ] Histórico dos avisos já enviados.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN020
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN020
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN020 |
| Requisito (SE) | SE017 |
| Caso de uso (UC) | UC22 |
| Tabelas do banco | Notificação, Turma |
| Sprint Backlog v1.0 | US30 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Professor |
| Prioridade | 50 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 5 (04/01/2027 a 29/01/2027) |
| Depende de | #5, #40 |
| Destrava | #51 |

<sub>PB50 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #51
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/51

## Historia de usuario

Como Secretaria, queremos enviar mensagens por WhatsApp e guardar o que foi enviado, para alcançar quem não abre o sistema e poder responder cobranças depois.

## Criterios de aceitacao

- [ ] Integração com um provedor de API de WhatsApp escolhido e documentado.
- [ ] Fila de envio com nova tentativa em caso de falha.
- [ ] Modelos de mensagem por tipo de aviso.
- [ ] Log com destinatário, canal, conteúdo, data e situação de entrega (SE035).
- [ ] Filtro do log por aluno, turma e período.
- [ ] Custo e limite de envio validados com a Secretaria antes de contratar.

## Tarefas tecnicas

- [ ] Implementar a regra no backend
- [ ] Definir o disparo: rotina agendada ou evento
- [ ] Gerar a notificacao correspondente
- [ ] Testes das regras RN007, RN020
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> Custo do provedor depende de aprovação de despesa pela Secretaria, com três propostas, como prevê a restrição de orçamento do Documento de Visão.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN007, RN020 |
| Requisito (SE) | SE017, SE034, SE035 |
| Caso de uso (UC) | UC23, UC39 |
| Tabelas do banco | Notificação |
| Sprint Backlog v1.0 | US31 |

## Planejamento

| | |
|---|---|
| Tipo | Melhoria |
| Area | Sistema |
| Prioridade | 51 de 54 |
| Estimativa | 13 pontos |
| Sprint prevista | 5 (04/01/2027 a 29/01/2027) |
| Depende de | #5, #50 |
| Destrava | — |

<sub>PB51 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
