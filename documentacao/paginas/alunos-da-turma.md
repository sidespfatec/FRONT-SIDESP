> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: alunos-da-turma

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #42
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/42

## Historia de usuario

Como professor, quero abrir a ficha do aluno da minha turma, para agir rápido em uma emergência.

## Criterios de aceitacao

- [ ] Ficha com contato, responsável e informações de saúde.
- [ ] Frequência do aluno no mês.
- [ ] Busca por nome dentro da turma.
- [ ] Acesso restrito aos alunos das turmas vinculadas ao professor (RN013).

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN013, RN017
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN013, RN017
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN013, RN017 |
| Requisito (SE) | SE018 |
| Caso de uso (UC) | UC21 |
| Tabelas do banco | Aluno, Turma, Presença |
| Sprint Backlog v1.0 | US25 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Professor |
| Prioridade | 42 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 4 (23/11/2026 a 18/12/2026) |
| Depende de | #5, #41 |
| Destrava | — |

<sub>PB42 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
