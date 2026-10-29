> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: analisar-justificativas

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #46
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/46

## Historia de usuario

Como administrador, quero analisar as justificativas em uma fila, para decidir sobre os cancelamentos com o documento em mãos.

## Criterios de aceitacao

- [ ] Fila de justificativas pendentes, com o documento anexado abrindo na própria tela.
- [ ] Ações de aceitar e recusar, com motivo obrigatório na recusa.
- [ ] O professor não tem acesso a esta tela (RN024).
- [ ] O aluno é notificado do resultado (RN025).
- [ ] Filtro por situação e por período.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN024, RN025
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN024, RN025
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN024, RN025 |
| Requisito (SE) | SE026 |
| Caso de uso (UC) | UC33 |
| Tabelas do banco | Justificativa, Presença |
| Sprint Backlog v1.0 | US28 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 46 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 5 (04/01/2027 a 29/01/2027) |
| Depende de | #5, #45 |
| Destrava | #47 |

<sub>PB46 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
