> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: inscricao-turma

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #33
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/33

## Historia de usuario

Como aluno ou responsável, quero me inscrever em uma turma de uma modalidade, para participar das atividades esportivas.

## Criterios de aceitacao

- [ ] A tela mostra o resumo da turma escolhida antes de confirmar.
- [ ] A inscrição é bloqueada quando o aluno já tem duas inscrições ativas, com mensagem explicando (RN001).
- [ ] A idade do aluno é validada contra a faixa etária da modalidade (RN008).
- [ ] Turma lotada não permite inscrição direta e oferece a lista de espera (RN009, RN012).
- [ ] Turma seletiva gera inscrição em avaliação, sem garantia de vaga (RN018).
- [ ] Quando o aluno é menor, a inscrição é feita pelo responsável titular do login (RN007).
- [ ] Após confirmar, a inscrição aparece em minhas turmas com a sua situação.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN001, RN007, RN008, RN009, RN012, RN018
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN001, RN007, RN008, RN009, RN012, RN018
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN001, RN007, RN008, RN009, RN012, RN018 |
| Requisito (SE) | SE007 |
| Caso de uso (UC) | UC08 |
| Tabelas do banco | Inscrição, Aluno, Turma, Modalidade |
| Sprint Backlog v1.0 | US14 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 33 de 54 |
| Estimativa | 8 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #20, #29, #32 |
| Destrava | #35, #37, #38 |

<sub>PB33 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #34
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/34

## Historia de usuario

Como sistema, preciso guardar a posição na fila, o prazo de confirmação e o motivo do cancelamento, para que a lista de espera e o cancelamento sigam as regras.

## Criterios de aceitacao

- [ ] inscricoes ganha posição na fila de espera (RN009), ou a ordem passa a ser derivada da data de inscrição já corrigida.
- [ ] inscricoes ganha prazo de confirmação da vaga oferecida (RN011).
- [ ] inscricoes ganha motivo e autor do cancelamento, para o cancelamento automático (RN005) e o manual do administrador (RN023).
- [ ] O status NA FILA DE ESPERA de status_inscricao passa a ter a posição correspondente.

## Tarefas tecnicas

- [ ] Revisar o modelo e atualizar o dicionario de dados
- [ ] Escrever a migration
- [ ] Aplicar as restricoes das regras citadas
- [ ] Rodar do zero em maquina limpa
- [ ] Atualizar o ERD e o diagrama de classes
- [ ] Revisao de outra pessoa do backend

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN005, RN009, RN010, RN011, RN023 |
| Requisito (SE) | SE008, SE009, SE024 |
| Caso de uso (UC) | UC09, UC10, UC11, UC29, UC31 |
| Tabelas do banco | inscricoes, status_inscricao |

## Planejamento

| | |
|---|---|
| Tipo | Correção |
| Area | Banco |
| Prioridade | 34 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #29 |
| Destrava | #35, #36, #39 |

<sub>PB34 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
