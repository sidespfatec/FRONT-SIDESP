# Banco SIDESP

Execute 00_criar_banco.sql somente para criar banco vazio. O Flyway no backend aplica V1 (31 tabelas do modelo), V2 (alterações autorizadas e contas) e V3 (catálogos e integridade CPF). Resultado: 32 tabelas de negócio e flyway_schema_history. 43 relações do modelo aprovado. Não há usuário/senha de cidadão no seed.

Arquivos em migrations são cópias para leitura: a versão executável é backend/src/main/resources/db/migration. Não execute duas vezes nem importe manualmente. A geração de CPF em hash ocorre na API, com chave externa; SQL não contém CPF de pessoas.

Tipos físicos e restrições de integridade complementam o modelo aprovado; as únicas mudanças lógicas são as registradas nas decisões de ADR-003/004. A tabela responsaveis guarda nascimento com nulabilidade transitória do modelo, mas a API desta versão exige nascimento válido de responsável adulto. Consulte docs/banco/ e docs/adr/.
