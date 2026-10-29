> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# PRD — v0.3 implementado

## Problema e objetivo
As telas de cadastro/login eram protótipos e agora estão integradas. Entregar uma API testável com persistência e autenticação, compatível com campos existentes e regras das issues, preservando interface e modelo estrutural.

## Entregas
Cadastro adulto (#11), login CPF/e-mail (#9), base de autenticação (#4), autorização backend de #10 e migrations de #1. Cadastro básico menor (#18/#17) com conta do adulto; anamnese permanece adiada e #18 parcial. Não alegar conclusão integral das issues com pendências de frontend.

## Critérios do backend
- CPF normalizado em 11 dígitos e validado; unicidade protegida no banco e em concorrência (RN016).
- Idade calculada na data do cadastro, sem guardar idade calculada; data futura/inválida recusada; 18 anos completos define adulto.
- Senhas confirmadas e hash; cadastro público atribui apenas perfil autorizado no servidor.
- Transação única para pessoa, documento/CPF, contatos, endereço e credencial: falha não deixa cadastro parcial.
- Login com credencial canônica aprovada; mensagem genérica para senha errada, conta inexistente/inativa.
- Perfil vem do banco; rotas protegidas recusam ausência/expiração e perfil incompatível (RN017/RN022).
- Nenhuma senha/hash/ficha médica em resposta pública.
- Front integrado no escopo autorizado; contrato e UI/sessão validados por testes HTTP e navegador.

## Fora da versão
Recuperação de senha #15, edição de perfil #16, criação de professores/admins #12/#13, inscrições, chamada, WhatsApp, relatórios, publicação, 2FA. Não criar endpoints vazios fingindo implementação.

## Aceitação e entrega futura
Testes de cadastro válido/duplicado, idade-limite, senha, rollback, login por identificador, expiração/perfil e criação limpa do banco. ZIP com backend/, frontend/ integrado, banco/ (migrations/dicionário/roteiro) e docs/. Backend/banco devem iniciar com instruções reproduzíveis e credenciais via variáveis. Testar em pelo menos duas máquinas com a equipe (#1); esta sessão não substitui essa evidência.

## Decisões confirmadas v0.2
Contas por pessoa titular, CPF hash canônico em documentos, responsável ligado à pessoa, e-mail obrigatório e senha mínima de 8 caracteres sem composição obrigatória. Anamnese adiada. Hash CPF não pode ser recuperado. Escopo exato e exceções estruturais em DECISOES-HEITOR.md; critérios de autenticação UI verificados em VALIDACAO.md.
