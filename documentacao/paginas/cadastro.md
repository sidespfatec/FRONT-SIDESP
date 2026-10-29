# Cadastro

A página `/registration` permite cadastrar uma pessoa adulta ou uma pessoa menor de idade. O formulário reúne dados pessoais, endereço e credenciais; para menor, solicita também os dados de um responsável adulto.

O CPF é validado e deve ser único. O e-mail é obrigatório. A senha precisa ter pelo menos oito caracteres, sem exigência de números ou símbolos. A data de nascimento não pode ser futura. A validação da tela ajuda a pessoa usuária, mas o servidor deve confirmar todas as regras.

Na inscrição de menor, a conta pertence ao responsável. Para vincular outro dependente a uma conta existente, é necessário comprovar o acesso com as credenciais exigidas pela API. O cadastro público não concede perfil de professor ou administrador. A API aceita ficha médica opcional, mas os campos de anamnese ainda não estão na interface preservada.

A página envia os dados para `POST /api/v1/auth/cadastros` e deve apresentar erros e confirmação de forma clara. O contrato completo está em [CONTRATO-API.md](../CONTRATO-API.md). Consulte também as issues #11, #17, #18 e #28 antes de alterar o fluxo.
