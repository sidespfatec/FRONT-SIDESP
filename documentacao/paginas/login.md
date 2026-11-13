# Login

A página `/login` recebe CPF ou e-mail e senha e envia os dados para `POST /api/v1/auth/login`. Após a autenticação, a aplicação guarda a sessão na aba e consulta a identidade e o perfil no servidor. O acesso às funcionalidades deve ser autorizado pelo backend.

A mensagem de erro deve ser genérica para conta inexistente, inativa ou senha incorreta. Não registrar credenciais ou tokens em logs. A sessão atual usa token com validade de 30 minutos; sair encerra a sessão local, sem representar necessariamente uma revogação imediata no servidor.

O link existente solicita um código de recuperação para o CPF preenchido; o backend envia por SMTP. A tela para informar código e nova senha ainda precisa ser descrita pela equipe e implementada. Consulte [CONTRATO-API.md](../CONTRATO-API.md) e as issues #9, #10 e #15 antes de alterar o fluxo.


## Integração visual da main — novembro de 2026

Estilos e apresentação alinhados à main, preservando os campos, validações e chamadas HTTP já integrados. Consulte [o guia da integração](../INTEGRACAO-FRONTEND-MAIN.md).


## Revisão visual da main

Templates e estilos da main preservados, com dados demonstrativos removidos e integrações existentes conectadas à estrutura original. Campos obrigatórios da API e ações ainda indisponíveis estão detalhados no [guia atualizado da integração](../INTEGRACAO-FRONTEND-MAIN.md). Este registro prevalece sobre descrições visuais históricas acima.
