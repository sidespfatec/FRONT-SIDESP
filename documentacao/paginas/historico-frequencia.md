> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: historico-frequencia

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #44
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/44

## Historia de usuario

Como aluno, quero acompanhar minhas presenças e faltas, para saber se estou perto do limite da modalidade.

## Criterios de aceitacao

- [ ] Histórico por aula, com data, conteúdo e presença.
- [ ] Contador de faltas do mês ao lado do limite da modalidade (RN002).
- [ ] Destaque de alerta ao chegar na segunda falta do mês (RN006).
- [ ] Aviso do risco de cancelamento automático ao ultrapassar o limite (RN005).

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN002, RN005, RN006
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN002, RN005, RN006
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN002, RN005, RN006 |
| Requisito (SE) | SE010 |
| Caso de uso (UC) | UC13 |
| Tabelas do banco | Presença, Chamada, Modalidade |
| Sprint Backlog v1.0 | US21 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 44 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 5 (04/01/2027 a 29/01/2027) |
| Depende de | #2, #5, #41 |
| Destrava | #45 |

<sub>PB44 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
