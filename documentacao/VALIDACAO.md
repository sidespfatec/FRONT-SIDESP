# Validação da Sprint 2

Executada em 29/10/2026, com Java 17, Spring Boot 3.5.16, Node 24 e MariaDB 10.11.14 isolado. Nenhum teste acessou banco de desenvolvimento ou produção.

| Verificação | Resultado |
|---|---|
| `npm run build` | Passou; avisos de tamanho de SCSS e Leaflet já presentes no frontend |
| Testes isolados de integração Angular | 19 passaram: sessão, interceptor, validação de cadastro e guard de perfil |
| Regras e compatibilidade criptográfica Java | 21 passaram |
| HTTP real com Spring e banco | 20 passaram |
| Atualização V3 populada → V4 | 1 passou |
| Total backend | 42 passaram, sem falhas e sem testes ignorados na execução com banco |
| Suíte completa do frontend da main | Não compila: imports antigos de classes nos testes de componentes |

Os testes HTTP cobrem adulto/menor, CPF/e-mail únicos, duplicidade concorrente, rollback, senha, JWT inválido/expirado, conta inativa, acesso total/parcial/aluno/professor/responsável, cadastros administrativos, polo inativo, faixa etária, perfil protegido, troca de senha, resposta genérica da recuperação, expiração e uso único do código. Também conferem a cifra médica, leitura administrativa e recusa de professor sem vínculo.

O envio SMTP foi simulado. Os testes confirmam a mensagem entregue ao componente de e-mail; não confirmam recebimento por um provedor real. Não foi feito teste visual completo em navegador, de teclado, responsividade ou dos componentes administrativos, que continuam sem conexão com os services.

A migration V4 foi aplicada do zero com V1–V3 e sobre banco V3 com responsável/polo já gravados. O Flyway também confirmou que uma segunda execução não reaplica as mudanças. Os relatórios desta execução estão em `evidencias/sprint2/`; os outros relatórios dessa pasta pertencem a entregas anteriores.

Não foram feitos push, publicação, alteração de um banco real nem fechamento de issues. As pendências funcionais da interface estão em [SPRINT2.md](SPRINT2.md).
