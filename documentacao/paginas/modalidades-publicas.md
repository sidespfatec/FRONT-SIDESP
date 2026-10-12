> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: modalidades-publicas

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #31
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/31

## Historia de usuario

Como aluno ou responsável, quero visualizar as modalidades esportivas disponíveis, para escolher uma modalidade para inscrição.

## Criterios de aceitacao

- [ ] A lista exibe nome, faixa etária e polo de cada modalidade.
- [ ] Cada modalidade indica se há vaga em alguma turma ou se todas estão lotadas.
- [ ] Modalidades inativas não aparecem (RN015).
- [ ] Modalidade fora da faixa etária do aluno logado aparece marcada como indisponível, com o motivo (RN008).
- [ ] Modalidade com turma seletiva aparece identificada (RN018).
- [ ] Existe filtro por polo e por faixa etária.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN008, RN015, RN018
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN008, RN015, RN018
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN008, RN015, RN018 |
| Requisito (SE) | SE006, SE020 |
| Caso de uso (UC) | UC07 |
| Tabelas do banco | Modalidade, Turma, Polo |
| Sprint Backlog v1.0 | US11 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 31 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #2, #20, #22 |
| Destrava | #32 |

<sub>PB31 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
