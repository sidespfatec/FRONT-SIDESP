> Atualização de publicação — 12/10/2026: Heitor autorizou expressamente criar uma branch nova, fazer push e abrir um pull request em sidespfatec/FRONT-SIDESP. As proibições históricas de publicação abaixo não se aplicam a essa solicitação. A pasta contribuicao, segredos, backups e credenciais administrativas locais ficam fora do Git.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Regras obrigatórias para IA

Leia CONTEXTO.md, PRD.md, PENDENCIAS.md, SEGURANCA.md, ADRs, a página alvo e as issues correspondentes antes de trabalhar.

1. Heitor autorizou agora a integração frontend de cadastro/login, sessão e proteção de rotas. Alterar somente o necessário nesse escopo; demais funcionalidades continuam fora desta entrega.
2. Não publicar, fazer PR ou escrever no repositório remoto. Miro pode receber apenas as alterações autorizadas na revisão v0.2. Entrega em ZIP; preparar checkout/branch local para o usuário é autorizado, mas não criar PR nem fazer push sem solicitação.
3. A documentação v0.2 foi revisada e Heitor autorizou o desenvolvimento. Para novas dúvidas de negócio/estrutura, perguntar antes de mudar a regra.
4. Não renomear, remover ou reorganizar tabelas, colunas, PKs/FKs ou cardinalidades do modelo existente. Complementos precisam ser vinculados a campos do cadastro ou issue e registrados no dicionário/ADR. Exceções autorizadas estão em DECISOES-HEITOR.md: aplicar somente essas mudanças. Em outros conflitos, perguntar.
5. Se houver dúvida de regra, titularidade, segurança, tipo, obrigatoriedade ou requisito, fazer perguntas específicas. Não transformar proposta em regra aprovada.
6. Nunca afirmar que um critério está concluído sem evidência. Marcar backend, banco, frontend e integração separadamente.
7. Não usar CPF, telefone, endereço ou saúde reais em testes nem enviá-los a IA externa. Não registrar senha/token ou dados sensíveis em logs.
8. Aplicar autorização no servidor; nunca confiar em perfil ou pessoaId enviados pelo cliente. Cadastro público não pode criar professor/administrador.
9. Hash de senha e queries parametrizadas. Sem segredo em código/ZIP; .env.example somente com placeholders. Não usar root em produção.
10. Migrations aplicadas são imutáveis; novas mudanças recebem nova versão. Proibido ddl-auto=update/create, clean automático e baseline automático em banco desconhecido.
11. Implementação simples em um único serviço. Validar transações, concorrência de CPF e permissões com testes apropriados no motor real.
12. Conferir dependências suportadas antes de fixar versões. Atualizar contexto, matriz, contratos e documentos da página após cada entrega.
13. Se o escopo mudar, registrar a autorização. Não adicionar endpoints ou coleta de dados por conveniência.

14. Métodos e construtores explícitos do backend recebem comentário de finalidade; manter legibilidade de iniciante sem retirar segurança/transação.
15. Migrations aplicadas não são editadas para adicionar explicações; cópias de estudo em banco/explicadas, nunca executadas.
16. Atualizações locais devem preservar config/local.properties, .env e trabalhoGit, combackup antes da cópia; não alegar acesso aoE: sem ferramenta de acesso disponível.
