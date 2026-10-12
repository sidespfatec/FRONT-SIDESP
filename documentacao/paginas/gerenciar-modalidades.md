> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página gerenciar-modalidades

Rota existente: `/manage-modalites`. Estado: documentação futura; backend não será implementado nesta etapa.

Oferta e inativação; preservar modalidades/turmas.

## Issue #21
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/21

## Historia de usuario

Como administrador, quero cadastrar modalidades definindo faixa etária e limite de faltas, para que os alunos se inscrevam conforme as regras do programa.

## Criterios de aceitacao

- [ ] O formulário coleta nome, idade mínima, idade máxima e limite de faltas mensais.
- [ ] O sistema impede idade mínima maior que a idade máxima.
- [ ] A modalidade fica ativa por padrão e é inativada, nunca excluída.
- [ ] A modalidade é vinculada a um polo já cadastrado.
- [ ] A modalidade cadastrada passa a aparecer para vínculo com turmas.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN002, RN008, RN015
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN002, RN008, RN015
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN002, RN008, RN015 |
| Requisito (SE) | SE020 |
| Caso de uso (UC) | UC25 |
| Tabelas do banco | Modalidade, Polo |
| Sprint Backlog v1.0 | US07 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 21 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 2 (28/09/2026 a 23/10/2026) |
| Depende de | #19, #20 |
| Destrava | #22 |

<sub>PB21 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


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
Ler CONTEXTO/AGENTS/SEGURANCA e critérios acima. Propor contrato antes do código, validar DTO no servidor, aplicar autorização por perfil e vínculo, transação nas escritas e testes da regra citada. Não alterar frontend fora do escopo autorizado nem estrutura fora das exceções aprovadas; não executar esta página no escopo de cadastro/login. Pontos em aberto da issue continuam pendentes, ainda que a página exista.
