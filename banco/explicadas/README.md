# Migrations explicadas linha por linha

Arquivos SQL aqui são materiais de estudo. NÃO execute nem importe: cada linha original vem precedida de explicação, inclusive as funções dos triggers. As versões executadas pelo Flyway ficam somente em `backend/src/main/resources/db/migration`; as cópias sem explicações em `banco/migrations` foram removidas por duplicação.

A V4 da Sprint 2 também tem uma cópia explicada aqui. Comentários separados permitem estudar o SQL sem alterar o histórico aplicado. A limpeza do repositório não modificou nenhuma migration oficial nem criou uma nova versão.

V1__modelo_base.sql: 329 linhas explicadas; original SHA256 84eb5e238695d22ce4114caf3e551a1cba50e13f5551d3345299019c0ef6a774
V2__cadastro_e_contas.sql: 25 linhas explicadas; original SHA256 f8bdfca287829c0ff78b971e3c46044c030715c11ae9dbba3e8adfc3a3691c4b
V3__catalogos_e_integridade_cpf.sql: 38 linhas explicadas; original SHA256 8f81dbb97f96e615ca462652d94e3c15bee4158de66e568c16ebe03db22aa62a
