# Cadastro de outro dependente

A rota /dependentes/novo usa POST /api/v1/responsavel/dependentes com a sessão do titular. Coleta dados pessoais do menor, endereço, parentesco e ficha médica com contato e telefone de emergência. CPF é opcional e deve ser válido quando informado. Após sucesso, atualiza a lista de dependentes da sessão. Falhas preservam os campos para correção. O backend confere maioridade do titular, vínculo e CPF único.
