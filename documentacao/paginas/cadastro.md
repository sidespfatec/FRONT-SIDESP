> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# Cadastro — /registration, revisão v0.2

Fontes: issues #1/#4/#11/#17/#18/#28 e decisões Heitor 05/10/2026. Executar somente depois da revisão documental. Frontend proibido.

POST /api/v1/auth/cadastros. DTO valida campos/limites; Service calcula idade e titularidade, normaliza CPF/e-mail, protege credenciais e salva em transação pessoa, documento, conta, contato/endereço e associação quando necessário. CPF canônico em documentos com HMAC; no máximo um por pessoa e nunca igual entre pessoas. E-mail obrigatório, cifrado/HMAC em contas; senha Argon2id mínimo 8 caracteres sem números/especiais obrigatórios.

Adulto é sua pessoa titular. Menor pode não ter CPF; responsável tem pessoa própria em pessoas, responsaveis.pes_id liga essa identidade adulta, conta referencia a pessoa adulta e associação permanece em responsaveis_dependentes. res_cpf removido, idade substituída por nascimento; sem preencher data desconhecida. Só reutilizar conta/responsável para novo dependente após autenticação e vínculo autorizado, nunca CPF isolado.

Complementos aprovados: UF/complemento/parentesco. Não coletar saúde nesta fase, nem alegar #18 completa. Perfil definido no servidor; cadastro público não cria admin/professor. Contato de responsável e endereço só acessíveis conforme vínculo. Não persistir confirmação de senha ou CPFLogin duplicado.

UI agora possui e-mail, requisições API e nascimento obrigatório do responsável; validar maioridade tanto na UI quanto no servidor. Pendências de dados reais/consentimento continuam #28.

Testes: CPF único global e por pessoa (inclusive concorrência), e-mail único obrigatório, senha de letras com 8 caracteres aceita, 7 recusada, Unicode contado corretamente, transação integral, 18 anos completos, vínculo de responsável e conta única, nenhum CPF legível em banco/log/resposta.

## Estado implementado v0.3
Consulte CONTRATO-API.md, IMPLEMENTACAO.md e VALIDACAO.md. A integração Angular foi autorizada e executada; nascimento responsável obrigatório no cadastro menor. Recuperação de senha e saúde permanecem adiadas.
