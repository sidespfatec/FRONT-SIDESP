# Desenvolvimento na nuvem — SIDESP

Este ambiente GitHub Codespaces instala Java 17, Maven pelo wrapper, Node 24,
npm, GitHub CLI e extensões de Java, Spring, Angular e banco. O MariaDB 10.11
roda em outro container, sem porta pública, com bancos `sidesp` e `sidesp_test`.
Base: `sidespfatec/FRONT-SIDESP`, branch `backend/integracao-sidesp-completa`.
O Angular está na raiz; o backend está em `backend/`.

## Abrir e desenvolver

1. Na branch com esta configuração, use **Code → Codespaces → Create codespace**.
2. Aguarde a instalação (`postCreateCommand`) e a compilação inicial.
3. Na aba **Ports**, abra a porta **4200** e navegue para `/login` ou `/registration`.
   Mantenha as portas como **Private**. A API fica na porta 8080.
4. Edite o Angular normalmente; o servidor atualiza a página. Depois de alterar
   Java, reinicie os serviços para recompilar o backend:

```bash
bash .devcontainer/stop.sh
bash .devcontainer/start.sh
```

Os serviços iniciam automaticamente ao reabrir o Codespace. Para conferir:

```bash
curl -f http://localhost:8080/api/v1/health
curl -f http://localhost:4200/api/v1/health
tail -n 80 .local/codespaces/backend.log
tail -n 80 .local/codespaces/frontend.log
```

O Angular usa o proxy existente para `/api`; não é necessário trocar URLs por
endereços públicos ou liberar CORS para qualquer origem.

## Testar e compilar

```bash
npm test -- --watch=false
npm run build
bash .devcontainer/test-backend.sh
```

O último comando executa também os testes de integração em `sidesp_test`,
separado do banco da aplicação. O Flyway aplica as migrations automaticamente.
Não importe as migrations novamente nem use o banco da aplicação nos testes.

Para E2E, siga o README e use uma instância/banco descartável próprio:
os testes criam cadastros e não fazem limpeza automática. Instale o navegador
quando for necessário com `npx playwright install --with-deps chromium`.

## Banco e persistência

No cliente SQL do VS Code: servidor `db`, porta `3306`, usuário `sidesp`, senha
fictícia `sidesp-dev-only`. As credenciais em compose.yaml servem somente para
este ambiente de desenvolvimento isolado. Não use em produção.

Os dados ficam no volume `mariadb-data`; as quatro chaves aleatórias ficam em
`backend/config/local.properties`, ignorado pelo Git, e nunca são regeneradas
quando o arquivo existe. Reiniciar ou reconstruir o mesmo ambiente preserva
o volume e o workspace. Não exclua volumes nem chaves para corrigir um erro.
Excluir o Codespace elimina seus arquivos locais e volumes: faça commit/push
dos fontes e backup separado, seguro e conjunto do banco e das chaves se quiser
conservar dados de teste. Um Codespace novo começa com banco e chaves novos.

Use dados fictícios; nenhum banco, segredo ou cadastro do computador local é
enviado para a nuvem. As limitações funcionais do código continuam existentes.

## Recursos e custos

Use inicialmente a máquina de 2 cores / 8 GB. Configure o tempo ocioso no GitHub
e pare o Codespace após trabalhar. Computação e armazenamento podem consumir
a franquia da conta e gerar cobrança conforme suas configurações. Esta
configuração não altera o limite de gastos nem contrata plano pago.

Também funciona no VS Code local com a extensão Dev Containers e Docker Compose.

## Validação em 26/10/2026

- Ambiente criado na branch `backend/integracao-sidesp-completa`, máquina de 2 cores/8 GB.
- Java 17 e Node 24 instalados; migrations V1–V3 aplicadas em `sidesp`.
- Backend: 35 testes passaram no Codespace, incluindo os 14 testes de integração
  com o banco separado `sidesp_test`; nenhum teste ignorado.
- Frontend: 19 testes e build de produção passaram na cópia limpa da mesma branch.
- Health `UP` diretamente na API e pelo proxy Angular; `/login` respondeu HTTP 200
  usando o hostname externo no cabeçalho Host.
- Reinício dos serviços validado; as chaves existentes permaneceram idênticas.

Se o endereço externo retornar HTTP 401 enquanto os dois comandos `curl` de
health retornam `UP`, confira a autenticação do encaminhamento privado no GitHub
e teste a sessão em outro navegador. Isso é diferente de uma resposta 401 do
endpoint de login da aplicação. Consulte a [documentação de acesso às portas
privadas](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces#port-forwarding).
