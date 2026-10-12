> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: lista-espera-aluno

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #36
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/36

## Historia de usuario

Como aluno ou responsável, quero entrar na lista de espera quando não houver vaga e acompanhar minha posição, para ser chamado assim que alguém sair.

## Criterios de aceitacao

- [ ] Ao tentar se inscrever em turma lotada, o aluno entra na fila na ordem de chegada, gravada em posicaoEspera (RN009).
- [ ] A posição na fila é visível na área do aluno.
- [ ] Quando surge vaga, o primeiro da fila recebe a oferta e é notificado (RN010, SE034).
- [ ] A oferta tem prazo de confirmação visível; vencido o prazo, a vaga passa ao próximo (RN011).
- [ ] O aluno consegue sair da lista de espera.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN009, RN010, RN011
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN009, RN010, RN011
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN009, RN010, RN011 |
| Requisito (SE) | SE008, SE034 |
| Caso de uso (UC) | UC09, UC11 |
| Tabelas do banco | Inscrição (status e posicaoEspera), Turma |
| Sprint Backlog v1.0 | US15 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 36 de 54 |
| Estimativa | 8 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #34, #35 |
| Destrava | #39 |

<sub>PB36 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
