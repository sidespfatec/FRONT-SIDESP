> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: gerenciar-alunos

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #38
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/38

## Historia de usuario

Como administrador, quero consultar e editar os dados dos alunos, para dar suporte e agir em situações de emergência.

## Criterios de aceitacao

- [ ] Busca por nome, CPF, modalidade e polo.
- [ ] Ficha do aluno com contato, responsável, inscrições e frequência.
- [ ] As informações de saúde só aparecem para quem tem perfil autorizado (RN017).
- [ ] É possível editar dados do aluno e inativar o cadastro.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN015, RN017
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN015, RN017
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN015, RN017 |
| Requisito (SE) | SE023 |
| Caso de uso (UC) | UC30 |
| Tabelas do banco | Aluno, Inscrição |
| Sprint Backlog v1.0 | US19 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 38 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #33 |
| Destrava | — |

<sub>PB38 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
