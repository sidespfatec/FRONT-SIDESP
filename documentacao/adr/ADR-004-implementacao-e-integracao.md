# ADR-004 — implementação e integração autorizadas

Status: implementado. Base: última instrução de Heitor, documentação v0.2 e ADR-003.

1. Integrar Angular cadastro/login e sessão/guards; substitui proibição anterior nesse escopo. E-mail obrigatório e nascimento do responsável incluídos sem remodelar o restante do produto.
2. Java17 / SpringBoot3.5.16 e MavenWrapper3.9.11. SpringJdbc/JdbcTemplate substitui proposta JPA para manter tabelas e relações sem ddl-auto. Repositório parametrizado e serviço transacional.
3. Responsável: data obrigatória API/UI, maioridade no servidor. Tipagem nullable do schema serve apenas evolução/histórico, sem aceitar responsável de idade desconhecida no cadastro novo.
4. JWT30min sem refresh em sessionStorage. Perfil/atividade consultados no servidor a cada requisição protegida; desativação bloqueia tokens já emitidos. Guard Angular melhora navegação; API é a autoridade.
5. Conta existente só recebe novo dependente após prova de posse por senha + e-mail corretos. Não redefinir senha por CPF. Informação de conflito permanece genérica.
6. Migrações executadas com MariaDB10.11.14 isolado. MySQL/XAMPP do usuário exige confirmação de versão e aplicação em banco vazio pelo guia; não alegar acesso ao computador do usuário.
7. Limitação por IP em memória; proxy reverso distribuído e controles de produção continuam pendentes.

Consequências: implementação simples em um serviço, sem alterar o resto do modelo; futuro banco recebe novas migrations incrementais, nunca alteração de V1–V3 aplicadas.
