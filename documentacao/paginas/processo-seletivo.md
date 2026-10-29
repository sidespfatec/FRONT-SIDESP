> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: processo-seletivo

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #49
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/49

## Historia de usuario

Como administrador, quero avaliar os candidatos de uma turma seletiva em um quadro, para aprovar as inscrições com clareza de etapa.

## Criterios de aceitacao

- [ ] Colunas por etapa: inscrito, em avaliação, aprovado e reprovado.
- [ ] O cartão do candidato é arrastado entre as colunas.
- [ ] A aprovação transforma a inscrição em vaga efetiva na turma (RN018).
- [ ] A reprovação registra o motivo e notifica o candidato.
- [ ] Contador de candidatos por coluna.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN018
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN018
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN018 |
| Requisito (SE) | SE025 |
| Caso de uso (UC) | UC32 |
| Tabelas do banco | Inscrição, Turma |
| Sprint Backlog v1.0 | US33 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 49 de 54 |
| Estimativa | 13 pontos |
| Sprint prevista | 5 (04/01/2027 a 29/01/2027) |
| Depende de | #39 |
| Destrava | — |

<sub>PB49 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
