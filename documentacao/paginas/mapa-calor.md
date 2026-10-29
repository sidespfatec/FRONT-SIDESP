> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: mapa-calor

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #53
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/53

## Historia de usuario

Como gestor, quero um mapa de calor com filtros, para decidir onde ampliar a oferta de atividades.

## Criterios de aceitacao

- [ ] Mapa com a concentração de alunos por região e por polo, usando latitude e longitude do polo.
- [ ] Filtros de lista de espera, satisfação, modalidade, gênero e faixa etária.
- [ ] O mapa é redesenhado a cada filtro sem travar, com o volume real de dados.
- [ ] Legenda explicando a escala de cores e resumo em números ao lado.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: as citadas no card
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes do comportamento entregue
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> O nível de satisfação aparece como filtro no protótipo e no Documento de Visão, mas não existe como atributo em nenhuma entidade do modelo. Precisa de decisão: cria-se o campo ou o filtro sai.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | — |
| Requisito (SE) | SE029 |
| Caso de uso (UC) | UC36 |
| Tabelas do banco | Polo, Aluno, Inscrição |
| Sprint Backlog v1.0 | US35 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 53 de 54 |
| Estimativa | 13 pontos |
| Sprint prevista | 6 (01/02/2027 a 26/02/2027) |
| Depende de | #20, #52 |
| Destrava | — |

<sub>PB53 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
