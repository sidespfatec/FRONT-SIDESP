> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

> Revisão v0.2: DECISOES-HEITOR.md e ADR-003 prevalecem sobre propostas anteriores. Fontes literais do backlog preservam histórico, não aprovação técnica atual.

# Rastreabilidade completa das issues

Todas as 54 issues foram consideradas. Estado remoto aberto não equivale a implementação ausente/concluída. Conteúdo integral preservado em fontes/issues.json.

| Issue | Título | Tratamento nesta etapa |
|---|---|---|
| [#1](https://github.com/sidespfatec/FRONT-SIDESP/issues/1) | PB01 · Completar a modelagem e criar as migrations do banco | Implementado no escopo cadastro/login; ver IMPLEMENTACAO/VALIDACAO |
| [#2](https://github.com/sidespfatec/FRONT-SIDESP/issues/2) | PB02 · Alinhar o diagrama de classes com o ERD | Preservar Miro atual; não aplicar mudança estrutural nesta fase |
| [#3](https://github.com/sidespfatec/FRONT-SIDESP/issues/3) | PB03 · Padronizar a nomenclatura do banco | Preservar Miro atual; não aplicar mudança estrutural nesta fase |
| [#4](https://github.com/sidespfatec/FRONT-SIDESP/issues/4) | PB04 · Acrescentar autenticação ao modelo de dados | Implementado no escopo cadastro/login; ver IMPLEMENTACAO/VALIDACAO |
| [#5](https://github.com/sidespfatec/FRONT-SIDESP/issues/5) | PB05 · Criar as tabelas de chamada, presença, justificativa e notificação | Preservar Miro atual; não aplicar mudança estrutural nesta fase |
| [#6](https://github.com/sidespfatec/FRONT-SIDESP/issues/6) | PB06 · Corrigir a base do front: rota inicial, 404, menu do rodapé, logo e template padrão | Fora do escopo, exceto integração de autenticação autorizada |
| [#7](https://github.com/sidespfatec/FRONT-SIDESP/issues/7) | PB07 · Criar o design system e os layouts base | Fora do escopo, exceto integração de autenticação autorizada |
| [#8](https://github.com/sidespfatec/FRONT-SIDESP/issues/8) | PB08 · Configurar HttpClient, environments e camada de services | HttpClient/environments/services implementados para autenticação |
| [#9](https://github.com/sidespfatec/FRONT-SIDESP/issues/9) | PB09 · Realizar login no sistema | Implementado no escopo cadastro/login; ver IMPLEMENTACAO/VALIDACAO |
| [#10](https://github.com/sidespfatec/FRONT-SIDESP/issues/10) | PB10 · Controlar acesso por perfil com guard e interceptor | Guard/interceptor integrados; autorização real na API; demais CRUD futuros |
| [#11](https://github.com/sidespfatec/FRONT-SIDESP/issues/11) | PB11 · Cadastrar aluno maior de idade | Implementado no escopo cadastro/login; ver IMPLEMENTACAO/VALIDACAO |
| [#12](https://github.com/sidespfatec/FRONT-SIDESP/issues/12) | PB12 · Cadastrar administrador | Documentar para etapa futura |
| [#13](https://github.com/sidespfatec/FRONT-SIDESP/issues/13) | PB13 · Cadastrar professor | Documentar para etapa futura |
| [#14](https://github.com/sidespfatec/FRONT-SIDESP/issues/14) | PB14 · Cotar hospedagem e obter aprovação da despesa | Documentar para etapa futura |
| [#15](https://github.com/sidespfatec/FRONT-SIDESP/issues/15) | PB15 · Recuperar senha | Documentar para etapa futura |
| [#16](https://github.com/sidespfatec/FRONT-SIDESP/issues/16) | PB16 · Editar perfil e alterar senha | Documentar para etapa futura |
| [#17](https://github.com/sidespfatec/FRONT-SIDESP/issues/17) | PB17 · Completar responsável, endereço e ficha médica no banco | Cadastro menor condicionado à modelagem/saúde |
| [#18](https://github.com/sidespfatec/FRONT-SIDESP/issues/18) | PB18 · Cadastrar aluno menor de idade pelo responsável | Cadastro menor condicionado à modelagem/saúde |
| [#19](https://github.com/sidespfatec/FRONT-SIDESP/issues/19) | PB19 · Cadastrar polos esportivos | Documentar para etapa futura |
| [#20](https://github.com/sidespfatec/FRONT-SIDESP/issues/20) | PB20 · Completar modalidade, turma e polo no banco | Preservar Miro atual; não aplicar mudança estrutural nesta fase |
| [#21](https://github.com/sidespfatec/FRONT-SIDESP/issues/21) | PB21 · Cadastrar modalidade | Documentar para etapa futura |
| [#22](https://github.com/sidespfatec/FRONT-SIDESP/issues/22) | PB22 · Gerenciar turmas | Documentar para etapa futura |
| [#23](https://github.com/sidespfatec/FRONT-SIDESP/issues/23) | PB23 · Vincular professor a polo, modalidade e turma | Documentar para etapa futura |
| [#24](https://github.com/sidespfatec/FRONT-SIDESP/issues/24) | PB24 · Acrescentar data de publicação em notícias | Preservar Miro atual; não aplicar mudança estrutural nesta fase |
| [#25](https://github.com/sidespfatec/FRONT-SIDESP/issues/25) | PB25 · Cadastrar e agendar notícia | Documentar para etapa futura |
| [#26](https://github.com/sidespfatec/FRONT-SIDESP/issues/26) | PB26 · Visualizar notícia completa | Documentar para etapa futura |
| [#27](https://github.com/sidespfatec/FRONT-SIDESP/issues/27) | PB27 · Exibir tela inicial pública | Documentar para etapa futura |
| [#28](https://github.com/sidespfatec/FRONT-SIDESP/issues/28) | PB28 · Proteger dados sensíveis e atender à LGPD | Governança/segurança documentadas; uso real bloqueado pelas decisões da issue |
| [#29](https://github.com/sidespfatec/FRONT-SIDESP/issues/29) | PB29 · Decidir entre inscricoes e turma_pessoas | Preservar Miro atual; não aplicar mudança estrutural nesta fase |
| [#30](https://github.com/sidespfatec/FRONT-SIDESP/issues/30) | PB30 · Visualizar polos e modalidades no mapa | Documentar para etapa futura |
| [#31](https://github.com/sidespfatec/FRONT-SIDESP/issues/31) | PB31 · Visualizar modalidades disponíveis | Documentar para etapa futura |
| [#32](https://github.com/sidespfatec/FRONT-SIDESP/issues/32) | PB32 · Visualizar turmas de uma modalidade | Documentar para etapa futura |
| [#33](https://github.com/sidespfatec/FRONT-SIDESP/issues/33) | PB33 · Inscrever-se em uma turma | Documentar para etapa futura |
| [#34](https://github.com/sidespfatec/FRONT-SIDESP/issues/34) | PB34 · Completar a inscrição no banco: fila, prazo e motivo | Preservar Miro atual; não aplicar mudança estrutural nesta fase |
| [#35](https://github.com/sidespfatec/FRONT-SIDESP/issues/35) | PB35 · Cancelar inscrição | Documentar para etapa futura |
| [#36](https://github.com/sidespfatec/FRONT-SIDESP/issues/36) | PB36 · Entrar e acompanhar a lista de espera | Documentar para etapa futura |
| [#37](https://github.com/sidespfatec/FRONT-SIDESP/issues/37) | PB37 · Visualizar minhas turmas | Documentar para etapa futura |
| [#38](https://github.com/sidespfatec/FRONT-SIDESP/issues/38) | PB38 · Gerenciar alunos | Documentar para etapa futura |
| [#39](https://github.com/sidespfatec/FRONT-SIDESP/issues/39) | PB39 · Gerenciar inscrições e fila de espera | Documentar para etapa futura |
| [#40](https://github.com/sidespfatec/FRONT-SIDESP/issues/40) | PB40 · Visualizar turmas do professor | Documentar para etapa futura |
| [#41](https://github.com/sidespfatec/FRONT-SIDESP/issues/41) | PB41 · Realizar chamada com diário de aula | Documentar para etapa futura |
| [#42](https://github.com/sidespfatec/FRONT-SIDESP/issues/42) | PB42 · Visualizar informações dos alunos da turma | Documentar para etapa futura |
| [#43](https://github.com/sidespfatec/FRONT-SIDESP/issues/43) | PB43 · Corrigir chamada já salva | Documentar para etapa futura |
| [#44](https://github.com/sidespfatec/FRONT-SIDESP/issues/44) | PB44 · Visualizar presenças, faltas e histórico | Documentar para etapa futura |
| [#45](https://github.com/sidespfatec/FRONT-SIDESP/issues/45) | PB45 · Enviar justificativa de falta com documento | Documentar para etapa futura |
| [#46](https://github.com/sidespfatec/FRONT-SIDESP/issues/46) | PB46 · Analisar e aprovar justificativa de falta | Documentar para etapa futura |
| [#47](https://github.com/sidespfatec/FRONT-SIDESP/issues/47) | PB47 · Contar faltas, alertar e cancelar inscrição automaticamente | Documentar para etapa futura |
| [#48](https://github.com/sidespfatec/FRONT-SIDESP/issues/48) | PB48 · Criar testes automatizados das regras de negócio | Planejar testes de auth; cobertura global fica futura |
| [#49](https://github.com/sidespfatec/FRONT-SIDESP/issues/49) | PB49 · Avaliar candidatos em Kanban de processo seletivo | Documentar para etapa futura |
| [#50](https://github.com/sidespfatec/FRONT-SIDESP/issues/50) | PB50 · Enviar aviso para a turma | Documentar para etapa futura |
| [#51](https://github.com/sidespfatec/FRONT-SIDESP/issues/51) | PB51 · Integrar com WhatsApp e registrar log de envios | Documentar para etapa futura |
| [#52](https://github.com/sidespfatec/FRONT-SIDESP/issues/52) | PB52 · Gerar relatórios com exportação em Excel e PDF | Documentar para etapa futura |
| [#53](https://github.com/sidespfatec/FRONT-SIDESP/issues/53) | PB53 · Exibir mapa de calor com filtros | Documentar para etapa futura |
| [#54](https://github.com/sidespfatec/FRONT-SIDESP/issues/54) | PB54 · Publicar o sistema em produção | Documentar para etapa futura |
