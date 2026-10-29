> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página turmas-da-modalidade

Rota existente: `/manage-modalites/:id/classes`. Estado: documentação futura; backend não será implementado nesta etapa.

Consultar/gerir turmas conforme perfil; capacidade e vínculos.

## Issue #22
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/22

## Historia de usuario

Como administrador, quero criar e manter turmas com horário, professor e vagas, para organizar as atividades de cada modalidade.

## Criterios de aceitacao

- [ ] A criação coleta modalidade, polo, professor, horário, número máximo de alunos e se a turma é seletiva.
- [ ] A listagem por modalidade mostra a ocupação de cada turma, inscritos sobre vagas.
- [ ] A turma é inativada, nunca excluída (RN015).
- [ ] O professor passa a enxergar a turma somente após o vínculo (RN013).
- [ ] Turma marcada como seletiva sinaliza que a inscrição não garante vaga (RN018).

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN012, RN013, RN015, RN018
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN012, RN013, RN015, RN018
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> Turma.horario é um texto único, sem dia da semana estruturado. Sem essa mudança, filtro por dia e verificação de conflito de horário do professor não são possíveis.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN012, RN013, RN015, RN018 |
| Requisito (SE) | SE022 |
| Caso de uso (UC) | UC28 |
| Tabelas do banco | Turma, Modalidade, Professor, Polo |
| Sprint Backlog v1.0 | US13 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 22 de 54 |
| Estimativa | 8 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #2, #20, #21 |
| Destrava | #23, #30, #31 |

<sub>PB22 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #32
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/32

## Historia de usuario

Como aluno ou responsável, quero ver as turmas de uma modalidade com horário, professor e vagas, para escolher a que caiba na minha rotina.

## Criterios de aceitacao

- [ ] As turmas da modalidade aparecem com horário, polo, professor e ocupação.
- [ ] Turma que atingiu o número máximo de alunos aparece como lotada, com a opção de lista de espera (RN009, RN012).
- [ ] Turmas inativas não aparecem (RN015).
- [ ] A partir da turma escolhida existe a ação de inscrever-se.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN009, RN012, RN015
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN009, RN012, RN015
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN009, RN012, RN015 |
| Requisito (SE) | SE012, SE022 |
| Caso de uso (UC) | UC12 |
| Tabelas do banco | Turma, Modalidade, Professor, Polo |
| Sprint Backlog v1.0 | US12 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 32 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #31 |
| Destrava | #33 |

<sub>PB32 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Ler CONTEXTO/AGENTS/SEGURANCA e critérios acima. Propor contrato antes do código, validar DTO no servidor, aplicar autorização por perfil e vínculo, transação nas escritas e testes da regra citada. Não alterar frontend fora do escopo autorizado nem estrutura fora das exceções aprovadas; não executar esta página no escopo de cadastro/login. Pontos em aberto da issue continuam pendentes, ainda que a página exista.
