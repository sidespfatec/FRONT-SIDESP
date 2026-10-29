# Orientações para desenvolvimento com IA

Estas orientações valem para todo o projeto. Leia também a issue correspondente, a documentação relacionada e o código existente antes de começar.

- Escreva de forma natural, clara e direta, como integrante da equipe. Não cite nomes de desenvolvedores nos textos produzidos.
- Prefira soluções simples e fáceis de entender para quem está aprendendo TypeScript, Angular, Bootstrap e Spring Boot, sem abrir mão de segurança, coerência e funcionamento. Reaproveite os padrões e dependências existentes.
- Atualize a documentação afetada sempre que alterar código, banco, comportamento ou configuração. Diferencie o que foi implementado, planejado e testado.
- Antes de desenvolver ou alterar uma página, é necessário que uma pessoa desenvolvedora escreva sua explicação em `documentacao/paginas/`. Leia essa explicação e a issue antes de começar. Se ela não existir ou faltar informação necessária, peça à equipe que a complete e aguarde; não invente o comportamento. Cadastro e login já possuem arquivos nessa pasta.
- Confirme regras de negócio contraditórias ou indefinidas com a equipe. Não trate uma issue ou protótipo como prova de implementação.
- Valide dados e permissões no servidor. Use consultas parametrizadas, proteja credenciais e dados pessoais e não inclua segredos ou dados reais em exemplos, testes ou logs.
- Não altere migrations já aplicadas: crie uma nova versão e teste a criação e a atualização do banco. Preserve dados e configurações locais.
- Execute os testes adequados à mudança e registre o que foi verificado e o que ficou pendente. Não afirme testes ou acesso a ambientes que não ocorreram.
