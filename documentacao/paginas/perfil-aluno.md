> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: perfil-aluno

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #16
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/16

## Historia de usuario

Como aluno, quero atualizar meus dados e trocar a minha senha, para manter o meu cadastro em dia.

## Criterios de aceitacao

- [ ] O formulário permite editar dados pessoais e de contato.
- [ ] O CPF é somente leitura para o aluno.
- [ ] A troca de senha exige a senha atual.
- [ ] Existe confirmação visual após salvar.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN016, RN017
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN016, RN017
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN016, RN017 |
| Requisito (SE) | SE013 |
| Caso de uso (UC) | UC16, UC17 |
| Tabelas do banco | Usuário, Aluno |
| Sprint Backlog v1.0 | US22 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Aluno |
| Prioridade | 16 de 54 |
| Estimativa | 3 pontos |
| Sprint prevista | 2 (28/09/2026 a 23/10/2026) |
| Depende de | #4, #9 |
| Destrava | — |

<sub>PB16 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
