> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# ADR-003 — identidade, proteção e contas
Estado: negócio aprovado por Heitor em 05/10/2026; detalhes técnicos definidos para revisão v0.2.

## Decisão
CPF canônico em documentos, exclusivamente como HMAC-SHA-256 (32 bytes). Nova coluna doc_cpf_hash nullable, UNIQUE global para valores não nulos; não usar SHA simples por ter baixo espaço de entradas. Validar CPF antes do hash. Um índice UNIQUE em doc_cpf_pes_id (coluna gerada: pes_id quando doc_cpf_hash não nulo, senão NULL) impede mais de um CPF por pessoa sem restringir RG/outros documentos. Regra adicional deve exigir hash exatamente nos documentos do tipo CPF e impedir CPF textual em doc_des. Como depende de catálogo em outra tabela, a migration deve usar trigger validado no motor real ou mecanismo equivalente; CHECK isolado não verifica catálogo estrangeiro. Catálogo CPF não pode ser renomeado/apagado depois sem migration.

contas: uma conta por pessoa titular. con_id PK, pes_id FK UNIQUE NOT NULL; senha em con_senha_hash (Argon2id), e-mail obrigatório cifrado em con_email_criptografado e HMAC em con_email_hash UNIQUE. con_ativo controla conta. Não duplicar CPF em contas nem armazenar senha em pessoas.

Responsável: pessoa adulta em pessoas; responsaveis.pes_id FK UNIQUE liga a pessoa responsável. Remover res_cpf; substituir res_idade por res_data_nascimento. Manter res_nome e tpc_id existentes nesta versão, consistentes com pessoas, sem novas remoções. Nascimento da pessoa/responsável deve corresponder quando conhecido; não inventar data ausente no formulário. Campo desconhecido nullable transitório deve ser registrado. responsaveis_dependentes permanece N:N com PK composta atual, mais parentesco opcional. Não atribuir dependente a conta existente só com seu CPF: exigir autenticação e vínculo comprovado antes de adicionar.

Perfil em tipos_cadastros (RN017/RN022). RESPONSAVEL como referência para adulto não aluno; ser responsável é vínculo, não autoriza autoproclamar-se professor/admin. Conflito de múltiplos papéis será tratado antes de ampliar permissões; nenhum CRUD de perfil no cadastro público.

## Criptografia e senha
HMAC do CPF é irreversível; recuperar CPF completo fica impossível. Não acrescentar cifra recuperável sem nova autorização. Backups de chave protegidos; não fazer rotação automática de hashes sem plano para recalcular entradas. Hashes continuam dados pessoais pseudonimizados, não anônimos.

Argon2id, salt aleatório, 19 MiB/2 iterações/1 paralelismo como ponto inicial de custo. Mínimo de oito pontos de código Unicode; composição livre; limite técnico proposto 128 caracteres. Não normalizar/remover espaços/truncar senha. E-mail cifrado AES-256-GCM com nonce novo por operação; envelope carrega nonce/tag/versão. Busca HMAC independente com chave distinta. Normalização consistente de e-mail para unicidade, sem modificar pontos/+.

JWT de 30 minutos, sem refresh, aprovado; sub=con_id, claims de perfil mínimos, sem CPF/e-mail/hash/endereço. Servidor consulta conta ativa/perfil em operações protegidas para não confiar apenas em permissão stale no token. Logout local descarta token, sem afirmar revogação individual imediata. Interceptor/persistência do Angular continuam fora da autorização.

## Consequências
Miro e documentação refletem exceções explícitas da preservação estrutural. Issue #4 dizia hash em pessoas; a nova autorização substitui esse armazenamento por contas. Issues remotas não foram alteradas. Requisitos de e-mail/anamnese/consentimento ausentes na interface impedem declarar cadastro ponta a ponta concluído.

Referências: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html e https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html .
