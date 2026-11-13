# Frontend da main com backend integrado

Referência visual: branch `main`, commit `8f57ef0109b00085b5320378586a5540efb5c87c`, e página pública `/FRONT-SIDESP/manage-teachers`. Base original do backend: `0208b4d`.

## Resultado desta revisão

A primeira integração mantinha componentes genéricos de professores e administradores, diferentes da main. Esta revisão substitui esses componentes nas páginas pelos templates originais da main. As regras de cadastro continuam compartilhadas por herança do componente de formulário existente; a página usa seu próprio HTML e SCSS.

Os 28 arquivos SCSS existentes na main foram copiados integralmente, sem ajustes de cores, tamanhos, margens, disposição ou fontes. Uma comparação de bytes confirmou a igualdade. Também foram preservadas todas as classes visuais dos nove templates integrados: professores, formulário de professor, administradores, formulário de administrador, polos, modalidades, nova modalidade, login e cadastro. As demais páginas mantêm os templates da main.

## Dados e ações

- Professores: lista e busca na estrutura original, consulta dos dados disponíveis, cadastro pelo diálogo original e alteração de situação pela API. O ícone de lixeira inativa/reativa o acesso; não exclui o histórico.
- Administradores: lista, ficha, cadastro e situação pela API. CPF não retornado pelo servidor aparece como protegido. A ficha não inventa contatos, nascimento ou auditoria ausentes na resposta.
- Polos: mapa, lista, busca e botões da main com dados da API. O diálogo de cadastro já integrado foi preservado porque a main não tinha um formulário funcional para esse botão.
- Modalidades: consulta, criação, polo ativo e situação pela API. Totais não retornados aparecem como `—`. Exclusão e personalização do ícone ficam indisponíveis, mantendo os controles no layout.
- Login e cadastro: markup e estilos da main, com os bindings e validações do backend. Foram preservados recuperação de senha, responsável para menor e ficha médica opcional.
- Os campos adicionais exigidos pelo contrato da API usam as classes dos formulários da main: gênero, registro profissional, UF e credenciais do professor; endereço completo e confirmação de senha do administrador; e-mail e nascimento do responsável no cadastro público. Nenhum valor obrigatório é inventado para preencher a requisição.
- Currículo, vínculo com turma, edição cadastral administrativa, dois fatores e publicação de notícias continuam sem endpoints implementados. Os controles visuais permanecem, mas não simulam sucesso. A consulta pelo lápis apresenta os dados disponíveis; salvar edição não suportada fica desabilitado.

Foram removidos registros e totais demonstrativos de professores, administradores, polos, modalidades, turmas, alunos, notícias, gráficos e histórico de exportações. Os catálogos de filtros, gêneros e tipos de relatório permanecem, pois definem a interface, não registros do banco. Sem endpoints, as respectivas listas ficam vazias e as métricas indisponíveis; exportar não anuncia um arquivo fictício.

## Organização

Os serviços HTTP ficam próximos às funcionalidades em `features/account/services`, `features/admins/manage-hubs/services`, `features/admins/modalites/services` e `features/admins/professionals/services`. Sessão, guards e interceptor permanecem em `core/auth`.

O backend permanece separado por funcionalidade em `cadastro`, `auth`, `recuperacao`, `perfil`, `professores`, `administradores`, `profissionais`, `polos`, `modalidades`, `dependentes` e `fichamedica`. `management` contém contratos compartilhados e `security` contém proteção e autorização. Esta revisão visual não altera endpoints, JSON, migrations ou SQL.

## Verificações e limites

- Build Angular concluído. Avisos remanescentes: orçamento do SCSS do cadastro, Leaflet CommonJS e imports sem uso já existentes na navegação pública.
- 38 testes Angular passaram em 10 arquivos. Quatro novos testes verificam lista de professores com resposta HTTP real de teste, ausência de linhas fictícias, abertura do formulário original, cartão de administradores e impedimento de avanço no cadastro inválido.
- Comparação automática: 28 SCSS idênticos à main e classes visuais preservadas nos nove templates integrados.
- A main pública foi inspecionada no navegador. O endereço do Codespace bloqueou a continuação neste navegador; não foi possível inspecionar a aplicação em execução nesse ambiente nem modificar o Codespace.
- Não foi concluída comparação por capturas de tela da versão corrigida, nem execução ponta a ponta contra banco. A igualdade dos estilos e a verificação de DOM não substituem essa validação visual.
- A compilação Java e os 21 testes unitários Java passaram na entrega anterior usando ECJ/JUnit Console. Não foram repetidos nesta revisão, que só altera frontend e documentação. Os 21 testes que exigem `sidesp_test` permanecem pendentes.

## Entrega

A gravação no GitHub foi recusada com HTTP 403 na conexão disponível. O pacote contém o código completo e patches aplicáveis à base original ou à primeira integração. A aplicação remota não é atualizada pela simples criação do arquivo; é necessário aplicar as alterações no repositório/Codespace e reiniciar o frontend.
