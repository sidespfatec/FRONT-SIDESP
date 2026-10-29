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

Os testes de integração de componentes usam o HttpTestingController para verificar contrato, preservação dos dados em erro, envio único, ausência de exemplos e atualização após confirmação do servidor. Os resultados executados estão registrados abaixo.

## Validação executada

- Build de produção aprovado localmente e no Codespace.
- Suíte completa do frontend: 32 testes aprovados em 9 arquivos.
- Cartão do cadastro conferido visualmente pela porta privada 4200.
- Avisos de build: tamanho do SCSS de cadastro acima do orçamento de aviso e dependência CommonJS do Leaflet; nenhum erro de compilação.

## Prévia compilada no Codespace

O ambiente desta validação usa o último build na porta 4200, com proxy da API para o backend na porta 8080. Para atualizar a prévia após alterar o frontend, execute npm run build e recarregue o navegador. O servidor da prévia é node .devcontainer/preview.mjs, executado na raiz; o backend continua lendo backend/config/local.properties quando iniciado de dentro de backend. Não execute a prévia junto com ng serve na mesma porta. O modo habitual de desenvolvimento continua disponível por bash .devcontainer/start.sh.

- Playwright no Codespace: 3 testes aprovados em 12,8 segundos. Incluem cadastro e persistência de professor/administrador parcial, inativação/reativação, polo/modalidade com vínculo real e validação de faixa etária, filtros, consulta de perfil e cartão branco. Registros sintéticos de teste foram inativados ao concluir, sem excluir dados.
- Recuperação por e-mail não foi testada de ponta a ponta por ausência de SMTP. Cadastro de dependente, consulta médica e alteração de senha estão integrados, mas não foram exercitados por esses três testes de navegador.
