> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: decisões de identidade em DECISOES-HEITOR.md/ADR-003 prevalecem sobre texto histórico das issues abaixo. Não implementar esta página no escopo atual.

# Página cadastro-administrador

Rota existente: `/new-admin-modal e /new-admin-modal/:id`. Estado: documentação futura; backend não será implementado nesta etapa.

Não permitir criação pública; inativação e CPF único; 2FA pendente.

## Issue #12
Fonte: https://github.com/sidespfatec/FRONT-SIDESP/issues/12

## Historia de usuario

Como administrador com acesso total, quero cadastrar novos administradores definindo o nível de permissão, para distribuir a gestão do sistema com controle de acesso.

## Criterios de aceitacao

- [ ] O formulário coleta dados pessoais, contato e nível de permissão.
- [ ] O nível de permissão é obrigatório e aceita acesso total ou parcial.
- [ ] CPF já existente é recusado.
- [ ] O administrador parcial não acessa as funções restritas ao total.
- [ ] O registro é inativado, nunca excluído.

## Tarefas tecnicas

- [ ] Endpoint no backend
- [ ] Regras de negocio no backend: RN015, RN016, RN022
- [ ] Service e model tipado no front
- [ ] Tela ou formulario no front
- [ ] Mensagens de erro, estado vazio e carregando
- [ ] Testes das regras RN015, RN016, RN022
- [ ] Teste ponta a ponta do fluxo
- [ ] Revisao de codigo

## :warning: Ponto em aberto

> O protótipo desta tela traz um botão de autenticação em dois fatores. Isso não está no modelo nem em nenhuma regra de negócio: ou entra como regra nova e formal, ou sai do protótipo.

> **Este item nao entra na sprint enquanto isto nao for decidido.**

## Rastreabilidade — Documento de Visao v1.0

| | |
|---|---|
| Regras de negocio | RN015, RN016, RN022 |
| Requisito (SE) | SE031 |
| Caso de uso (UC) | UC38 |
| Tabelas do banco | Usuário, Administrador |
| Sprint Backlog v1.0 | US05 |

## Planejamento

| | |
|---|---|
| Tipo | Funcionalidade |
| Area | Admin |
| Prioridade | 12 de 54 |
| Estimativa | 5 pontos |
| Sprint prevista | 2 (28/09/2026 a 23/10/2026) |
| Depende de | #10 |
| Destrava | — |

<sub>PB12 · gerado a partir do Product Backlog v2.0 do SIDESP</sub>


## Orientação para IA
Ler CONTEXTO/AGENTS/SEGURANCA e critérios acima. Propor contrato antes do código, validar DTO no servidor, aplicar autorização por perfil e vínculo, transação nas escritas e testes da regra citada. Não alterar frontend fora do escopo autorizado nem estrutura fora das exceções aprovadas; não executar esta página no escopo de cadastro/login. Pontos em aberto da issue continuam pendentes, ainda que a página exista.
