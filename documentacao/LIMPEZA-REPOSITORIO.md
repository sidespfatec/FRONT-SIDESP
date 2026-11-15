# Limpeza do repositório — 15/11/2026

Revisão da branch `backend/integracao-sidesp-completa`, partindo de `f66db69b6706f588a03e2b0091e7565821d2d642`. Foram examinados os fontes Angular e Spring, dependências, configurações de build/testes, Codespaces, CI, migrations, publicação e documentação.

## Removido

- 33 arquivos gerados em `docs/`, totalizando 24.388.319 bytes: diretório `browser/` duplicado, 20 bundles main antigos e três folhas de estilo sem referência na publicação atual.
- Quatro arquivos de SSR sem configuração de entrada no build Angular: `src/server.ts`, `src/main.server.ts`, `src/app/app.config.server.ts` e `src/app/app.routes.server.ts`.
- Script `serve:ssr:SIDESP`, que apontava para um servidor não gerado pelo build. Dependências diretas `@angular/platform-server`, `@angular/ssr` e `@types/express`, usadas apenas pelo servidor removido, também foram retiradas. O lockfile removeu 12 pacotes ao todo, sem atualizar as versões restantes.
- Três cópias SQL idênticas em `banco/migrations/`. A comparação byte a byte foi feita antes da remoção. V1–V4 oficiais permanecem em `backend/src/main/resources/db/migration`, sem alterações.
- Relatórios de instalação `ATUALIZACAO-LOCAL.md` e `README-ATUALIZACAO.md`, que descreviam outra instalação e scripts ausentes. As instruções atuais permanecem no README e na documentação de backend/Codespaces.
- Referência a um arquivo inexistente em `tsconfig.spec.json` e entradas dos arquivos SSR removidos em `tsconfig.app.json`.

A configuração de hidratação foi retirada porque a aplicação atual não fornece HTML renderizado por um servidor Angular.

## Preservado

- GitHub Pages: a configuração consultada publica `main/docs`. Foram mantidos `index.html`, `404.html`, o main atual, os chunks alcançáveis por referências nos HTML/JS/CSS, assets, fontes, ícones e licenças. Nenhum desses arquivos mantidos foi editado. A configuração do Pages e a main não foram alteradas.
- Express: `.devcontainer/preview.mjs` depende dele para servir a prévia e encaminhar a API. Foram preservados os scripts do Codespaces.
- Código funcional, componentes, testes, contratos, fontes de requisitos e evidências. Ausência de referência textual não prova que um componente Spring esteja sem uso, pois ele pode ser registrado por injeção de dependências.
- SQL explicado, dicionários e decisões de arquitetura: são documentação, não cópias executáveis das migrations.
- Configurações/chaves, banco da instalação local e arquivos de trabalho fora deste checkout.

## Limite da redução

A remoção reduz os arquivos presentes nesta branch e evita transportar bundles antigos para novas instalações. Os blobs antigos continuam no histórico Git. Não houve reescrita de histórico; o tamanho de um clone completo pode continuar incluindo esses objetos.

## Validação

- `npm ci --no-audit --no-fund`: instalação inicial concluída. Após remover as dependências diretas de SSR, `npm install --ignore-scripts --no-audit --no-fund` sincronizou a instalação e o lockfile; `npm ls --depth=0` confirmou que as dependências restantes estão resolvidas.
- `npm run build`: aprovado. Permanecem avisos de Leaflet CommonJS e orçamento de CSS do cadastro (7,04 kB diante de um aviso de 6 kB).
- `npm test -- --watch=false`: 38 testes aprovados em dez arquivos. A afirmação antiga de falha de imports no README não se aplica a este estado e foi atualizada. Nenhum teste foi removido.
- Suíte específica `src/app/core/**/*.spec.ts`: 32 testes aprovados em cinco arquivos, incluídos nos 38 da suíte completa.
- `backend/mvnw.cmd test --batch-mode`: 21 testes unitários aprovados; os 21 testes de integração/migrations foram explicitamente ignorados por ausência de banco de teste configurado. Nenhuma conexão foi feita ao banco de aplicação durante a limpeza.
- Conferência das referências HTML/JS/CSS da publicação: 55 arquivos mantidos e nenhum bundle removido referenciado por esses arquivos. Os arquivos mantidos em `docs/`, o conteúdo de `.devcontainer/` e as migrations oficiais não têm alterações no diff.

Não foram executados E2E em navegador, Docker/Codespaces ou testes em banco real nesta limpeza. Não se atribui aumento de velocidade em produção sem medição; a redução comprovada é de arquivos redundantes e pacotes instalados.
