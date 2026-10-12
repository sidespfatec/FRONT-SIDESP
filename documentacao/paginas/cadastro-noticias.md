> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: cadastro-noticias

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #24
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/24

## Historia de usuario

Como administrador, quero que a notícia tenha data de publicação no banco, para que o agendamento aconteça sozinho em vez de alguém virar a chave na mão.

## Criterios de aceitacao

- [ ] noticias ganha coluna de data de publicação (RN021).
- [ ] O status EM ESPERA passa a ser consequência da data, e não uma marcação manual.
- [ ] Conteúdo unificado em um campo de texto longo, no lugar de ntc_conteudo_1 e ntc_conteudo_2 com mil caracteres cada.
- [ ] Notícia agendada não aparece na consulta pública antes da data (RN021).

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
| Regras de negocio | RN021 |
| Requisito (SE) | SE004, SE030 |
| Caso de uso (UC) | UC01, UC37 |
| Tabelas do banco | noticias, noticia_status |

## Planejamento

| | |
|---|---|
| Tipo | Correção |
| Area | Banco |
| Prioridade | 24 de 54 |
| Estimativa | 2 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #1 |
| Destrava | #25 |

<sub>PB24 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #25
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/25

## Historia de usuario

Como administrador, quero cadastrar notícias com data de publicação, para que apareçam automaticamente na tela inicial no dia planejado.

## Criterios de aceitacao

- [ ] O formulário coleta título, conteúdo, imagem e data de publicação.
- [ ] Notícia com data futura não aparece na tela inicial antes da data (RN021).
- [ ] É possível editar e despublicar uma notícia já cadastrada.
- [ ] O upload de imagem é validado por tipo e tamanho.
- [ ] A listagem mostra a situação de cada notícia: publicada ou agendada.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN021, RN022
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN021, RN022
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> O módulo de notícias já existente no backend trata título, conteúdo e imagem, mas não o agendamento. O modelo tem dataPub e publicada, então a alteração é no backend, não na modelagem.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN021, RN022 |
| Requisito (SE) | SE030 |
| Caso de uso (UC) | UC37 |
| Tabelas do banco | Notícia, Administrador |
| Sprint Backlog v1.0 | US10 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 25 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #10, #24 |
| Destrava | #26 |

<sub>PB25 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
