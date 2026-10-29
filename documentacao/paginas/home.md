> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página home

Rota existente: `/home`. Estado: documentação futura; backend não será implementado nesta etapa.

Notícias públicas e mapa; não retornar dados pessoais.

## Issue #27
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/27

## Historia de usuario

Como visitante, quero ver na tela inicial as notícias e as modalidades oferecidas, para conhecer o programa e decidir me cadastrar.

## Criterios de aceitacao

- [ ] A tela abre sem exigir login.
- [ ] As notícias aparecem da mais recente para a mais antiga (SE004).
- [ ] Somente notícias com data de publicação já alcançada aparecem (RN021).
- [ ] Existe bloco de divulgação das modalidades com navegação para a tela de modalidades.
- [ ] Visitante vê Entrar e Cadastre-se; usuário logado vê as ações do seu perfil.
- [ ] Nenhum dado de aluno é exibido para visitante (RN017).

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN017, RN021
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN017, RN021
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> O conteúdo institucional da Secretaria (apresentação, contato) não existe como entidade. Definir se fica fixo no front ou se vira conteúdo editável.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN017, RN021 |
| Requisito (SE) | SE004, SE006 |
| Caso de uso (UC) | UC01 |
| Tabelas do banco | Notícia, Modalidade, Polo |
| Sprint Backlog v1.0 | US08 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Publico |
| Prioridade | 27 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #26 |
| Destrava | — |

<sub>PB27 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #26
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/26

## Historia de usuario

Como visitante, quero abrir uma notícia da tela inicial, para ler o conteúdo completo.

## Criterios de aceitacao

- [ ] A tela exibe título, imagem, data de publicação e conteúdo completo.
- [ ] O endereço da notícia pode ser compartilhado.
- [ ] Existe navegação de volta para a tela inicial.
- [ ] Notícia não publicada não é acessível nem pelo endereço direto (RN021).

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN021
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN021
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN021 |
| Requisito (SE) | SE005 |
| Caso de uso (UC) | UC02 |
| Tabelas do banco | Notícia |
| Sprint Backlog v1.0 | US09 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Publico |
| Prioridade | 26 de 54 |
| Estimativa | 3 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #25 |
| Destrava | #27 |

<sub>PB26 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Issue #30
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/30

## Historia de usuario

Como visitante, quero ver no mapa onde ficam os polos e quais modalidades cada um oferece, para escolher o mais perto de mim antes de me cadastrar.

## Criterios de aceitacao

- [ ] Mapa com um marcador por polo, usando latitude e longitude do cadastro.
- [ ] Lista ao lado do mapa, sincronizada com o que está visível.
- [ ] Ao escolher um polo aparecem as modalidades, horários e vagas restantes.
- [ ] Filtro por modalidade e por faixa etária.
- [ ] A tela abre sem exigir login.
- [ ] Funciona em tela de celular.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN008, RN015
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN008, RN015
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> Este caso de uso não tinha item nem User Story em nenhuma versão do backlog, nem no Sprint Backlog v1.0. É a única tela pública além da inicial e do detalhe de notícia.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN008, RN015 |
| Requisito (SE) | SE006 |
| Caso de uso (UC) | UC03 |
| Tabelas do banco | Polo, Modalidade, Turma |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Publico |
| Prioridade | 30 de 54 |
| Estimativa | 8 pontos |
| Sprint prevista | 3 (26/10/2026 a 20/11/2026) |
| Depende de | #20, #22 |
| Destrava | — |

<sub>PB30 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Ler CONTEXTO/AGENTS/SEGURANCA e critérios acima. Propor contrato antes do código, validar DTO no servidor, aplicar autorização por perfil e vínculo, transação nas escritas e testes da regra citada. Não alterar frontend fora do escopo autorizado nem estrutura fora das exceções aprovadas; não executar esta página no escopo de cadastro/login. Pontos em aberto da issue continuam pendentes, ainda que a página exista.
