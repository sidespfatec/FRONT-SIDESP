# ADR-005 — backend didático, migrations preservadas e contribuição

Data: 12/10/2026. Status: implementado. Heitor pediu frontend anexado, comentários em todos os métodos, SQL explicado, refatoração simples, documentação atualizada e preparação paraPR.

1. Anexo 137 arquivos e main remoto correspondem ao commit 2046d37; a integração já existente é mantida sobre essa base. Nenhum layout de nova versão diferente foi observado.
2. Manter monólito Controller→Service→Repository/JDBC. Separar registerAdult/registerMinor/ensureGuardian e helpers curtos; trocar lógica comprimida/lambdas longas por if/for e nomes explícitos. Não adicionar ORM, mapeador de DTO ou microsserviço por conveniência.
3. Todos os métodos/construtores explícitos Java (incluindo testes) têm comentários e formatação consistente; registros imutáveis continuam records.
4. Preservar HMAC do CPF/e-mail, envelope AES-GCMv1, Argon2id, JWT e transações. Testes independentes verificam compatibilidade do HMAC e envelope, chaves inválidas e janela de tentativas.
5. Não modificar V1–V3 aplicadas. Explicações linha porlinha ficam em banco/explicadas, fora do classpath Flyway. Não criar migration vazia. Mesma estrutura32 tabelas/43 relações e catálogos; sem necessidade de alterarMiro.
6. E: não está acessível. Atualizador local cria backup e preserva config/chaves/Git/caches; não afirma execução no Windows. Script decontribuição mantémAngular na raiz do GitHub, clona emnova pasta e cria branch local; não commit/push/PR automáticos. Conta conectada tinha push, fork opcional.
7. WorkflowCI definido para build/test Angular eJUnit com MariaDB isolado, incluindoTEST_DB_URL. Sua execução no GitHub depende de o usuário publicar a branch/PR.

Limites: não observar alterações particulares na pastaE:; script não remove trabalho desconhecido, mas a cópia substitui arquivos do pacote após backup. Aprovação humana/revisão de outro integrante continuam responsabilidade da equipe. Nenhuma issue remota foi alterada.
