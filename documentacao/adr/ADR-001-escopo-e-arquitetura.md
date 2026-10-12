> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# ADR-001 — escopo e arquitetura
Estado: restrições do usuário confirmadas; escolhas técnicas propostas.

Um backend Java/Spring Boot em aplicação única, com Controller → Service → Repository, DTOs separados das entidades. Maven Wrapper, Web, Validation, Security, Data JPA, driver do motor confirmado e Flyway. Java 21 é proposta; versão Spring Boot suportada será fixada no início da implementação após verificar documentação oficial e compatibilidade.

Sem TypeORM/NestJS, embora a issue #3 mencione TypeORM em texto antigo. A stack Java da solicitação prevalece. Sem microsserviços ou IA em runtime. Frontend congelado. Consequência: API testável independentemente, integração Angular não entregue.

Referência técnica consultada: https://docs.spring.io/spring-boot/system-requirements.html . Não fixar versão apenas pela data desta documentação.
