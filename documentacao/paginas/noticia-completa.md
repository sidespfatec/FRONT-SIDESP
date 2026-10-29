> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: noticia-completa

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

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


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
