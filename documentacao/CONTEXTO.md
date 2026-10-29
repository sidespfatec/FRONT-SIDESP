> Registro anterior à Sprint 2. Para o estado implementado em 29/10/2026, consulte [SPRINT2.md](SPRINT2.md), [BACKEND.md](BACKEND.md), [CONTRATO-API.md](CONTRATO-API.md) e [VALIDACAO.md](VALIDACAO.md). As descrições abaixo documentam a base anterior e não substituem esses arquivos.

# Contexto do projeto

O SIDESP é um sistema para apoiar a gestão das atividades esportivas da Secretaria de Esportes de Guaratinguetá. O projeto prevê cadastros, turmas, inscrições, frequência, comunicação e relatórios, com acesso de acordo com o perfil.

O frontend usa Angular e TypeScript. O backend usa Java e Spring Boot, com banco relacional e migrations Flyway. Cadastro e login possuem integração no código; as demais funcionalidades devem ser conferidas no código e nas issues antes de serem consideradas concluídas.

As [issues](https://github.com/sidespfatec/FRONT-SIDESP/issues) descrevem o backlog e os critérios de aceitação. Algumas possuem itens pendentes ou informações antigas; compare com o código, o modelo de dados e as decisões da equipe. Em caso de divergência, peça esclarecimento antes de alterar uma regra.

O documento de visão e outras cópias em `fontes/` são referências históricas. Os diagramas e dicionários em `banco/` ajudam a entender a estrutura, mas devem ser atualizados quando o banco mudar.
