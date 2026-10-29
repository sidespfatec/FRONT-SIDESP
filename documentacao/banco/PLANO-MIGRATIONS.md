> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

# Migrations implementadas

V1__modelo_base.sql: baseline das31tabelas/41relações anteriores. V2__cadastro_e_contas.sql: contas, hashCPF e índices, responsável-pessoa, nascimento, remoção res_cpf, UF/complemento/parentesco. V3__catalogos_e_integridade_cpf.sql: catálogos sem cidadãos e triggers para impedir CPF legível e alteração do tipoCPF. Resultado32tabelas/43relações +tabela técnicaFlyway.

DDL executado: backend/src/main/resources/db/migration. Copias em banco/migrations idênticas para revisão. Flyway gerencia histórico/checksum; clean e baseline automáticos desabilitados. Não há ddl-auto. Banco pré-existente sem histórico é recusado para revisão.

Nova funcionalidade: primeiro revisar issue/diagrama/ADR; criar V4__descricao.sql (depois V5 etc.), preferir mudanças compatíveis e backfill auditável. Testar banco vazio e atualização da versão anterior. Nunca modificar migration já aplicada. Não renomear/reorganizar entidades fora das exceções autorizadas.
