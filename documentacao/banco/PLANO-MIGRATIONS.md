# Migrations implementadas

V1__modelo_base.sql: baseline das31tabelas/41relações anteriores. V2__cadastro_e_contas.sql: contas, hashCPF e índices, responsável-pessoa, nascimento, remoção res_cpf, UF/complemento/parentesco. V3__catalogos_e_integridade_cpf.sql: catálogos sem cidadãos e triggers para impedir CPF legível e alteração do tipoCPF. Resultado32tabelas/43relações +tabela técnicaFlyway.

DDL executado: backend/src/main/resources/db/migration. Essa é a única fonte das migrations oficiais. As cópias idênticas em banco/migrations foram removidas na limpeza; as cópias didáticas em banco/explicadas permanecem. Flyway gerencia histórico/checksum; clean e baseline automáticos desabilitados. Não há ddl-auto. Banco pré-existente sem histórico é recusado para revisão.

Nova funcionalidade: primeiro revisar issue/diagrama/ADR; criar V5__descricao.sql (depois V6 etc.), preferir mudanças compatíveis e backfill auditável. Testar banco vazio e atualização da versão anterior. Nunca modificar migration já aplicada. Não renomear/reorganizar entidades fora das exceções autorizadas.

## V4 — Sprint 2

Aplicada em teste do zero e sobre V3 com dados. O dicionário V4 e o modelo atual foram extraídos do banco migrado; `CLASSES-V4.mmd` representa o domínio, não classes JPA. As classes Java usam DTOs e JDBC. A cópia comentada de V4 em `banco/explicadas` serve apenas para leitura. Não reaplicar essa cópia.
