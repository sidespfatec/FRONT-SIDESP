# Integração das telas — 29/10/2026

As alterações conectam a interface existente aos endpoints da Sprint 2, sem alterar o backend nem migrations.

- Professores e administradores: cadastro completo, listagem real, busca por nome, filtro de situação, consulta de resumo e inativação/reativação com confirmação HTTP.
- Polos: criação com endereço e coordenadas, listagem com busca e situação e mapa de registros reais. Modalidades: criação com polo ativo, faixa etária e faltas mensais, listagem e alteração de situação.
- Não há sucesso local quando a API falha. Formulários preservam os campos em erro e impedem envio repetido enquanto a gravação está pendente.
- Cadastro público: cartão branco recuperado e ficha médica opcional. Perfil: consulta/edição do titular e alteração de senha com encerramento da sessão. Dependente: cadastro autenticado com ficha médica. Recuperação: confirmação do código e nova senha no login; SMTP continua necessário.
- Fichas médicas: consulta pelo ID real em /fichas-medicas, apenas administração ou professor com vínculo conferido no servidor. A tela não usa IDs de alunos demonstrativos.

## Limites do contrato atual

Não existe endpoint para editar cadastros profissionais, editar polos/modalidades, CRUD de turmas, listagem administrativa de alunos, relatórios ou mapa de calor. Os botões de edição fictícia foram substituídos por consulta do que a API devolve. As áreas sem API estão rotuladas como demonstração. Não são informadas contagens, vínculos, CPF, telefone ou e-mail que o resumo HTTP não oferece. Não foram criadas rotas de backend para contornar autorização.

## Verificar

~~~bash
npm ci
npm run build
npx ng test --watch=false --ts-config=tsconfig.integration.spec.json --include='src/app/core/**/*.spec.ts'
~~~

Os testes de integração de componentes usam o HttpTestingController para verificar contrato, preservação dos dados em erro, envio único, ausência de exemplos e atualização após confirmação do servidor. As evidências de navegador e resultados realmente executados devem ser registrados ao concluir a validação.
