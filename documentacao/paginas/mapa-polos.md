> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: mapa-polos

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

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
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
