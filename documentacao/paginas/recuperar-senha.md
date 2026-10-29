> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página futura: recuperar-senha

Não há rota específica confirmada no snapshot; não criar rota ou frontend. Estado: guia para adições futuras, fora da primeira implementação.

## Issue #15
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/15

## Historia de usuario

Como usuário cadastrado, quero redefinir minha senha informando CPF ou e-mail, para recuperar o acesso caso eu a esqueça.

## Criterios de aceitacao

- [ ] A tela é acessível pelo link "Esqueceu a senha?" do login.
- [ ] O sistema envia link ou código com validade limitada.
- [ ] O token é de uso único e a senha antiga deixa de funcionar.
- [ ] A nova senha respeita o mesmo critério mínimo do cadastro.
- [ ] A mensagem de retorno é a mesma exista ou não o usuário informado.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN017
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN017
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> Política de senha mínima a confirmar com o backend, como já registrado no Sprint Backlog v1.0.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN017 |
| Requisito (SE) | SE003 |
| Caso de uso (UC) | UC06 |
| Tabelas do banco | Usuário |
| Sprint Backlog v1.0 | US02 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Publico |
| Prioridade | 15 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 2 (28/09/2026 a 23/10/2026) |
| Depende de | #4, #9 |
| Destrava | — |

<sub>PB15 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Implementar somente quando autorizada a issue. Contrato HTTP deve ser derivado dos critérios, sem inventar endpoints nesta fase. Usar entidades/relacionamentos do Miro, validar autorização de titular/perfil/vínculo e entrada no servidor, proteger transações e testar regras citadas. Perguntar por pontos em aberto; nenhum critério de frontend está autorizado nesta entrega. Registrar qualquer complemento em ADR e migration incremental.
