> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página gerenciar-polos

Rota existente: `/manage-hubs`. Estado: documentação futura; backend não será implementado nesta etapa.

Cadastro de polos e endereço; inativação histórica.

## Issue #19
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/19

## Historia de usuario

Como administrador, quero cadastrar e manter os polos, para organizar onde as atividades acontecem.

## Criterios de aceitacao

- [ ] O formulário coleta nome, endereço, latitude e longitude do polo.
- [ ] A listagem tem busca e filtro de ativos e inativos.
- [ ] O polo é inativado, nunca excluído (RN015).
- [ ] Um polo inativo não aparece para escolha em modalidade nem em turma.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN015
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN015
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> Este caso de uso não tinha User Story em nenhum documento do projeto, e é pré-requisito de modalidade e turma no modelo.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN015 |
| Requisito (SE) | SE019 |
| Caso de uso (UC) | UC24 |
| Tabelas do banco | Polo |
| Sprint Backlog v1.0 | US17 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 19 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 2 (28/09/2026 a 23/10/2026) |
| Depende de | #1 |
| Destrava | #21 |

<sub>PB19 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #20
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/20

## Historia de usuario

Como time, queremos as colunas que faltam na estrutura da oferta, para que as regras de idade, de seleção e de horário tenham onde existir.

## Criterios de aceitacao

- [ ] modalidades ganha idade mínima e idade máxima (RN008): hoje a tabela tem só id e descrição.
- [ ] Marcação de processo seletivo criada em turmas ou em modalidades (RN018).
- [ ] Limite de faltas posicionado conforme a decisão do PB02: em modalidades pela RN002, ou mantido em turmas com a RN alterada.
- [ ] turmas ganha horário e dias da semana (SE012, SE022).
- [ ] polos ganha latitude e longitude (SE006, SE029) e o tipo de pol_des é definido.

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
| Regras de negocio | RN002, RN008, RN018 |
| Requisito (SE) | SE006, SE012, SE020, SE022, SE029 |
| Caso de uso (UC) | UC03, UC07, UC25, UC28, UC36 |
| Tabelas do banco | modalidades, turmas, polos |

## Planejamento

| | |
|---|---|
| Tipo | Correção |
| Area | Banco |
| Prioridade | 20 de 54 |
| Estimativa | 8 pontos |
| Sprint prevista | 2 (28/09/2026 a 23/10/2026) |
| Depende de | #1, #2 |
| Destrava | #21, #22, #30, #31, #33, #53 |

<sub>PB20 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Ler CONTEXTO/AGENTS/SEGURANCA e critérios acima. Propor contrato antes do código, validar DTO no servidor, aplicar autorização por perfil e vínculo, transação nas escritas e testes da regra citada. Não alterar frontend fora do escopo autorizado nem estrutura fora das exceções aprovadas; não executar esta página no escopo de cadastro/login. Pontos em aberto da issue continuam pendentes, ainda que a página exista.
