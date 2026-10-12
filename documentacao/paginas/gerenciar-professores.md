> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página gerenciar-professores

Rota existente: `/manage-teachers`. Estado: documentação futura; backend não será implementado nesta etapa.

Cadastro administrativo e vínculos; RN013/RN015/RN016.

## Issue #13
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/13

## Historia de usuario

Como administrador, quero cadastrar professores com seus dados profissionais, para que possam ser vinculados a turmas e modalidades.

## Criterios de aceitacao

- [ ] O formulário coleta dados pessoais, contato e dados profissionais (registro e especialidade).
- [ ] CPF já existente é recusado.
- [ ] O professor fica ativo por padrão.
- [ ] Recém-cadastrado, o professor não enxerga nenhuma turma até o vínculo ser feito.
- [ ] O registro é inativado, nunca excluído.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN013, RN015, RN016
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN013, RN015, RN016
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> O protótipo de cadastro de professor tem os campos Endereço e Cidade, que não existem em nenhuma entidade do modelo — apenas Polo tem endereço. Ver também o PB17.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN013, RN015, RN016 |
| Requisito (SE) | SE021 |
| Caso de uso (UC) | UC26 |
| Tabelas do banco | Usuário, Professor |
| Sprint Backlog v1.0 | US06 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 13 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 2 (28/09/2026 a 23/10/2026) |
| Depende de | #10 |
| Destrava | — |

<sub>PB13 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #23
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/23

## Historia de usuario

Como administrador, quero vincular o professor às suas turmas, para que ele veja e registre chamada apenas onde leciona.

## Criterios de aceitacao

- [ ] É possível vincular e desvincular professor de uma turma.
- [ ] Professor sem vínculo não acessa nenhuma turma (RN013).
- [ ] A tela mostra quantas turmas cada professor tem.
- [ ] Desvincular não apaga as chamadas já registradas por ele.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN013
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN013
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN013 |
| Requisito (SE) | SE021 |
| Caso de uso (UC) | UC27 |
| Tabelas do banco | Professor, Turma |
| Sprint Backlog v1.0 | US18 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 23 de 54 |
| Estimativa | 3 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #22 |
| Destrava | #40 |

<sub>PB23 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Ler CONTEXTO/AGENTS/SEGURANCA e critérios acima. Propor contrato antes do código, validar DTO no servidor, aplicar autorização por perfil e vínculo, transação nas escritas e testes da regra citada. Não alterar frontend fora do escopo autorizado nem estrutura fora das exceções aprovadas; não executar esta página no escopo de cadastro/login. Pontos em aberto da issue continuam pendentes, ainda que a página exista.
