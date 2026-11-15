# Banco SIDESP

Execute `00_criar_banco.sql` somente para criar um banco vazio. O Flyway no backend aplica V1–V4 automaticamente. Não há usuário/senha de cidadão no seed.

As migrations oficiais ficam somente em `backend/src/main/resources/db/migration`. As cópias idênticas de V1–V3 em `banco/migrations` foram removidas para evitar duplicação e divergência. Não execute duas vezes nem importe manualmente. A geração de CPF em hash ocorre na API, com chave externa; SQL não contém CPF de pessoas.

Os SQL em `explicadas/` são materiais didáticos e não devem ser executados. Consulte o dicionário atual em `documentacao/banco/DICIONARIO-V4.md` e as decisões em `documentacao/adr/`.
