# Pendências — v0.3

P01–P07 e P11 resolvidos conforme DECISOES-HEITOR e ADR-003/004; cadastro/login implementados e integrados. Não repetir perguntas já respondidas.

- P08: anamnese adiada; #18 permanece parcial.
- P09: SELECT VERSION() e teste na instalação XAMPP de Heitor. Entrega validada em MariaDB10.11.14; acesso ao XAMPP local não ocorreu.
- P10/#28: consentimentos/base legal, auditoria, retenção e processo de direitos antes de dados reais.
- #15: recuperação de senha/entrega por e-mail futura; não há redefinição por CPF.
- Outras páginas permanecem protótipos; seus documentos orientam futuras tarefas, não significam APIs entregues.
- Produção: HTTPS, usuárioDBdedicado, backup seguro das chaves, política de sessão/XSS, proxy reverso/IP e limitação distribuída, confirmação de e-mail conforme regra a aprovar.

Sem PR/alteração GitHub. Frontend autorizado somente para integração de autenticação. Banco preservado fora das exceções aprovadas; novas mudanças exigem nova migration e decisão registrada.
