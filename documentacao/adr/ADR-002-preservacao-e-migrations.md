> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# ADR-002 — preservação e migrations v0.2
Estado: preservação obrigatória com exceções autorizadas por Heitor.

Base histórica 31 tabelas/41 relações; revisão 32 tabelas/43 relações. Exceções: contas, responsaveis.pes_id, remover res_cpf, substituir res_idade por nascimento, complementar documento/CPF e campos de cadastro UF/complemento/parentesco. Nenhuma outra remoção/renomeação autorizada.

CPF máximo um por pessoa e único entre pessoas; representação protegida e restrições em ADR-003/dicionário v0.2. Sem SQL anterior segundo o usuário, baseline será criada após revisão dos detalhes. Não inferir engine/versão por “XAMPP atualizado”.

Flyway proposto conforme aprovação de migrations escaláveis. Histórico técnico declarado; backend mantém scripts canônicos. Evolução por novas versões imutáveis, ddl-auto=validate, sem baseline/clean automático. Ordem de catálogos/triggers deve ser definida antes da criação das restrições de CPF. Não prometer rollback transacional de DDL MySQL/MariaDB.

Plano detalhado em banco/PLANO-MIGRATIONS.md. Nenhum script aplicado. Fonte: https://documentation.red-gate.com/flyway/flyway-concepts/migrations/versioned-migrations .
