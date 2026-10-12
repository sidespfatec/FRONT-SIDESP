> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Governança, ética e compliance

Documento de trabalho, não certificação de conformidade. Referência: LGPD, Lei 13.709/2018, texto oficial https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm . Dados de saúde, crianças/adolescentes e tratamento pelo poder público requerem definição específica de finalidade, base legal e proteção; consentimento não deve ser presumido como solução única.

## Responsabilidades propostas para validar
PO valida finalidade/regras; Tech Lead arquitetura/migrations; backend implementa; QA verifica; Secretaria define controlador, operadores, encarregado/canal do titular, base legal, retenção e acesso. Papéis acadêmicos do PDF não equivalem automaticamente a papéis legais.

## Antes de dados reais (#28)
Definir política de privacidade e termo exigido pela issue, tratamento de menores, acesso à ficha, registro de acesso sensível, prazo de retenção e descarte/backups. Aprovação pela Secretaria deve ser registrada. Não afirmar #28 encerrada com esta documentação.

## Ética e processo
Coletar apenas o necessário; não ampliar informações de saúde nesta fase. Não inferir gênero, tutela ou autorização por nome/CPF. Respeitar revisão humana e acesso por função. Dados sintéticos em repositório, testes e IA; revisão de licença/origem de dependências antes de distribuição.

Mudança: ligar solicitação a issue, registrar ADR, revisar privacidade e migration, testar, revisar com Tech Lead/QA. Nenhuma nova estrutura ou regra entra implicitamente. Alterações futuras de UI são tarefa separada e permanecem proibidas nesta entrega.

## Registro de decisões
Cada aprovação: data, decisão, responsável, issue, ADR, impacto em coleta/acesso e evidência de teste. Preservar histórico sem informações pessoais. Direitos dos titulares e incidentes devem ter canal e procedimento aprovados, sem prometer exclusão automática de registros públicos históricos.
