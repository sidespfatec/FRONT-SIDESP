> Registro anterior à Sprint 2. Para o estado implementado em 29/10/2026, consulte [SPRINT2.md](SPRINT2.md), [BACKEND.md](BACKEND.md), [CONTRATO-API.md](CONTRATO-API.md) e [VALIDACAO.md](VALIDACAO.md). As descrições abaixo documentam a base anterior e não substituem esses arquivos.

# Testes

Execute os testes afetados por cada mudança. No cadastro e login, confira pelo menos CPF válido e único, senha mínima, datas, cadastro de menor com responsável adulto, tentativa de acesso indevido, login e sessão expirada. Mudanças no banco também devem ser verificadas em banco vazio e em uma base de teste na versão anterior.

Use dados fictícios e um banco isolado. Não use dados pessoais reais. Os testes de integração precisam do banco de teste configurado; confira o README e os próprios testes para identificar quais foram executados ou ignorados. Para a interface, teste os fluxos alterados, incluindo erros, navegação e diferentes tamanhos de tela quando fizer sentido.

A cobertura das demais regras deve acompanhar cada funcionalidade e a issue #48. Registre ambiente, comandos, resultados e limitações em [VALIDACAO.md](VALIDACAO.md).
