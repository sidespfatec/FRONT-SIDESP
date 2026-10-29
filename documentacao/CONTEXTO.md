> Atualização de publicação — 12/10/2026: acesso local ao Windows/XAMPP realizado; frontend sincronizado e backend em funcionamento. Heitor autorizou branch nova, push e PR para sidespfatec/FRONT-SIDESP, excluindo contribuicao. Os registros antigos de ausência de acesso ao E: e de proibição de PR são históricos. Evidências atuais em PUBLICACAO-GITHUB.md e ../ATUALIZACAO-LOCAL.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Contexto permanente do projeto

SIDESP: Sistema Integrado de Desenvolvimento Esportivo Público, conforme Documento de Visão v1.0. Secretaria de Esportes de Guaratinguetá. Heitor confirmou Secretaria de Esportes em 05/10/2026.

Objetivo: centralizar cadastros, inscrições, turmas, frequência, comunicação e relatórios, reduzindo registros repetidos e permitindo acesso por perfil. Perfis: aluno, professor, administrador total/parcial e responsável (este último com pessoa titular, conta e vínculo de dependentes na revisão v0.2).

Equipe indicada no PDF: Kauã — Scrum Master/backend; Lívia — PO/frontend; Heitor — Tech Lead/backend; Luís Mario — backend; Diego — frontend; Micael — QA. Validar responsáveis atuais antes de atribuir tarefas.

## Fontes de verdade
1. Instruções atuais: implementar cadastro/login, integrar frontend e testar; não criar PR; preservar banco exceto alterações aprovadas. A proibição inicial de frontend foi substituída expressamente por Heitor.
2. Issues: regras e critérios de aceitação; conflitos devem ser perguntados.
3. Miro atual: tabelas, nomes e relações; não substituir por descrições antigas das issues.
4. PDF v1.0: contexto e RN001–RN025 / SE001–SE035.
5. Frontend: campos efetivamente existentes; ausência não revoga requisitos de issue.

Repositório: https://github.com/sidespfatec/FRONT-SIDESP
Snapshot main analisado: 2046d3764142a80c38dd7073058a67c236adab1f.
Miro: https://miro.com/app/board/uXjVHowMI1Q=/
Fontes preservadas em fontes/. Consultar novamente issues e Miro antes de implementar se houver alterações. Não interpretar checkbox como teste realizado por esta entrega.

## Escopo atual
Cadastro público e login; Java/Spring Boot; banco solicitado MySQL no XAMPP. Sem microsserviços, WhatsApp, inscrições, recuperação de senha, relatórios ou sistema de IA em produção nesta fase. Documentar extensões sem executá-las.

## Regras globais
RN001: até duas modalidades simultâneas. RN002–RN006: limites/justificativas de falta e alertas. RN007: responsável recebe avisos de menor. RN008–RN012: idade, vagas e fila. RN013–RN014: professor vinculado e conteúdo da aula obrigatório. RN015: inativar cadastros históricos. RN016: CPF único. RN017: autorização por perfil. RN018: seleção quando exigida. RN019: correções de chamada apenas por administrador com justificativa. RN020–RN021: avisos imediatos e notícias agendadas. RN022: administrador total/parcial. RN023–RN025: exceção administrativa justificada e avaliação/notificação de justificativas.

Para redação literal das regras, consultar fontes/documento-visao.txt; este resumo não resolve divergências. Miro atual distingue pedido em inscricoes de participação em turmas_pessoas e frequência em chamadas/diarios; não unir essas tabelas.

## Registro de continuidade
Concluído: documentação revisada, backend Java, três migrations e integração Angular. Validação: 30 testes backend em MariaDB isolado e testes Angular/navegador conforme VALIDACAO.md. O XAMPP de Heitor não foi acessado; executar o guia local. Respostas de Heitor em DECISOES-HEITOR.md. Toda sessão deve atualizar este registro, ADRs e rastreabilidade.

## Continuidade v0.4 — 12/10/2026
Heitor autorizou substituir frontend com o anexo, comentar/refatorar backend e preparar contribuição. Os137arquivos anexados são idênticos à base2046d37 e mainremoto; integração preservada. Backend didático implementado, todas as migrations canônicas idênticas, explicadas fora doFlyway. Scripts locais combackup/configpreservada e clone/branchGit sempush/PR. E: indisponível; não afirmar atualização no computador. Leia README-ATUALIZACAO/ADR-005/VALIDACAO.
