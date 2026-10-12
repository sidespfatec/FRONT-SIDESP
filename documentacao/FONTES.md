> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Fontes e limites da análise
Consulta em 05/10/2026.
- GitHub issues: https://github.com/sidespfatec/FRONT-SIDESP/issues ; 54 itens, conteúdo completo em fontes/issues.json. Único comentário em #7 diz que layout administrativo levará mais de uma sprint, sem mudar regras de auth.
- Repositório main: 2046d3764142a80c38dd7073058a67c236adab1f; árvore e arquivos selecionados preservados. Não foi encontrado AGENTS.md nem migration SQL na árvore consultada. README/package/rotas e HTML/TS das duas telas foram lidos.
- Miro: https://miro.com/app/board/uXjVHowMI1Q=/ ; leitura de 3 itens: diagrama, documento e tabela das 41 cardinalidades. Snapshot SVG preservado; 31 tabelas extraídas. Outros documentos citados no texto do Miro não foram tratados como lidos se não presentes nessa leitura.
- Documento de Visão v1.0 anexado: conteúdo textual integral em fontes/documento-visao.txt. Diagramas/protótipos gráficos no PDF não foram extraídos como especificação executável; modelo atual do Miro foi fonte estrutural.
- Spring: https://docs.spring.io/spring-boot/system-requirements.html ; compatibilidade deve ser reconferida quando fixar dependências.
- Flyway: https://documentation.red-gate.com/flyway/flyway-concepts/migrations/versioned-migrations ; migrations versionadas e imutáveis depois de aplicadas.
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm ; referência oficial para validação com Secretaria, sem certificação jurídica nesta entrega.

Não houve conexão ao banco do usuário, acesso ao XAMPP, execução de migrations ou testes de autenticação. Checkboxes das issues foram preservados como declarações da fonte e não verificação própria.

## Revisão v0.2
Heitor respondeu às decisões em 05/10/2026. Miro atualizado e relido: 3 itens, diagrama com contas, sem res_cpf/res_idade, 43 linhas de cardinalidades. Snapshot em fontes/modelo-miro-v0.2-verificado.svg. A geometria verificada mantém 132 px entre documento/diagrama e 123 px entre diagrama/tabela, sem sobreposição. Repositório e issues não foram escritos.
