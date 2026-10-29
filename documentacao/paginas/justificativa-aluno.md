> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: justificativa-aluno

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #45
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/45

## Historia de usuario

Como aluno ou responsável, quero justificar uma falta anexando o comprovante, para não perder a vaga na modalidade.

## Criterios de aceitacao

- [ ] A justificativa é permitida apenas para a terceira falta do mês (RN003).
- [ ] O anexo de documento é obrigatório, com tipo e tamanho validados (RN004).
- [ ] A justificativa fica ligada à presença correspondente.
- [ ] A situação é visível para o aluno: enviada, aceita ou recusada.
- [ ] Falta com justificativa aceita deixa de contar no limite.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN003, RN004
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN003, RN004
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN003, RN004 |
| Requisito (SE) | SE011 |
| Caso de uso (UC) | UC14, UC15 |
| Tabelas do banco | Justificativa, Presença, Aluno |
| Sprint Backlog v1.0 | US27 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 45 de 54 |
| Estimativa | 8 pontos |
| Sprint prevista | 5 (04/01/2027 a 29/01/2027) |
| Depende de | #5, #44 |
| Destrava | #46 |

<sub>PB45 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
