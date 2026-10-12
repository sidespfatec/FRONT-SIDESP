> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Model Card — uso de IA no desenvolvimento

Não há modelo de machine learning integrado ao SIDESP, treinamento, dataset de aprendizado ou pontuação de pessoas. Este card documenta a IA como ferramenta auxiliar para código/documentação.

Uso permitido: explicar requisitos, propor contratos, escrever código/testes após revisão, revisar migrations. Entrada: fontes do projeto e exemplos sintéticos. Saída exige revisão humana. Nome/versão de modelo usado em futuras sessões deve ser registrado se disponível; não é dependência do produto.

Limitações: IA pode inventar regras, tipos e relacionamentos ou interpretar issue antiga como modelo atual. Mitigação: rastreabilidade, ADRs, perguntas em conflito e comparação com Miro. Não declarar testes não executados, implementação pronta ou conformidade jurídica certificada.

Proibições: enviar dados reais/credenciais; inferir saúde ou capacidade esportiva; aprovar inscrição, justificar faltas ou decidir elegibilidade com IA; alterar frontend/estrutura para facilitar implementação.

Avaliação: conformidade com issues, validação de segurança, testes de comportamento e revisão Tech Lead/QA. Métricas de ML (acurácia, bias estatístico de modelo) não se aplicam. Futuro recurso de IA exige novo PRD, Data Card, Model Card e avaliação humana antes de uso.
