> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: relatorios

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #52
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/52

## Historia de usuario

Como gestor, quero relatórios de participação, frequência e evasão com exportação, para acompanhar o programa e enviar os números à Secretaria.

## Criterios de aceitacao

- [ ] Filtros de período, polo, modalidade e professor aplicados à tabela e aos gráficos.
- [ ] Quantitativo de alunos por modalidade, por polo e por professor (SE027).
- [ ] Relatório de frequência por turma e período.
- [ ] Relatório de evasão com o motivo: cancelamento por falta ou desistência.
- [ ] Recortes por gênero e faixa etária.
- [ ] Exportação em Excel e PDF respeitando os filtros, com cabeçalho de período e data de geração (SE028).

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: as citadas no card
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes do comportamento entregue
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | — |
| Requisito (SE) | SE027, SE028 |
| Caso de uso (UC) | UC34, UC35 |
| Tabelas do banco | Inscrição, Presença, Aluno, Turma, Modalidade |
| Sprint Backlog v1.0 | US34 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 52 de 54 |
| Estimativa | 13 pontos |
| Sprint prevista | 6 (01/02/2027 a 26/02/2027) |
| Depende de | #47 |
| Destrava | #53 |

<sub>PB52 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
