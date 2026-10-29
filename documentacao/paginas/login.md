> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# Login — /login, revisão v0.2

Issues #4/#9/#10; RN016/RN017/RN022; ADR-003 atualizado prevalece sobre texto antigo de senha em pessoas.

POST /api/v1/auth/login. CPF: validar/normalizar, calcular HMAC, localizar documentos→pessoa→conta. E-mail: normalizar e HMAC, buscar conta única. Comparar senha Argon2id, verificar conta ativa/perfil e responder JWT de 30 minutos sem refresh. Mensagem genérica para conta inexistente/inativa ou senha errada.

JWT sub=con_id, sem CPF/e-mail/hash/dados pessoais. Autorizar operações pelo servidor com perfil atual e vínculos; impedir alteração de titular/perfil no payload. Conta responsável acessa somente seus dependentes, sem token próprio para criança nesta primeira versão.

CPF não pode ser recuperado do hash nem exibido completo. Não usar senha como chave de CPF/e-mail. Limitar tentativas e tratar falhas sem segredo em logs. Testes de login CPF/e-mail, conta inativa, hash adulterado, token expirado, vínculo/perfil e chave HMAC incorreta como erro operacional, sem downgrade de segurança.

UI ainda navega direto a /home, sem serviço/interceptor/persistência. Não alterar. Recuperação #15 continua futura; sessão das telas não será declarada integrada. Logout local não é revogação individual imediata.

## Estado implementado v0.3
Consulte CONTRATO-API.md, IMPLEMENTACAO.md e VALIDACAO.md. A integração Angular foi autorizada e executada; nascimento responsável obrigatório no cadastro menor. Recuperação de senha e saúde permanecem adiadas.
