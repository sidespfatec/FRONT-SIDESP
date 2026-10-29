> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# Dicionário — alterações v0.2

Esta especificação complementa o snapshot anterior DICIONARIO-OBSERVADO.md (histórico). Demais tabelas/colunas/relações permanecem. Não é SQL executável. Contagem após revisão: 32 tabelas, 43 relações.

## contas — nova
| Coluna | Tipo físico proposto | Restrição/finalidade |
|---|---|---|
| con_id | INT | PK, geração automática proposta |
| pes_id | INT | FK pessoas; NOT NULL; UNIQUE; pessoa titular |
| con_email_criptografado | VARBINARY(512) | NOT NULL; envelope AES-GCM para e-mail UTF-8 de até 254 caracteres/bytes conforme contrato |
| con_email_hash | BINARY(32) | NOT NULL UNIQUE; HMAC de e-mail normalizado |
| con_senha_hash | VARCHAR(255) | NOT NULL; hash Argon2id autocontido |
| con_ativo | BOOLEAN | NOT NULL DEFAULT TRUE |

Envelope deve caber em 512 bytes; validar comprimento UTF-8 do e-mail e envelope antes de persistir, sem truncar. Chaves externas separadas, sem valores no esquema/ZIP.

## documentos — complemento
| Coluna | Tipo | Restrição/finalidade |
|---|---|---|
| doc_cpf_hash | BINARY(32) | NULL fora de CPF; UNIQUE para valores não nulos; HMAC do CPF |
| doc_cpf_pes_id | INT GENERATED STORED | CASE quando hash não nulo então pes_id senão NULL; UNIQUE; máximo um CPF por pessoa |

doc_des VARCHAR(20) permanece para descrição/identificação curta de outros documentos. CPF nunca é gravado nele; para CPF usar rótulo não identificador “CPF protegido”. Trigger planejado valida tipo CPF ↔ presença do hash e proíbe o uso de valor CPF no rótulo. O catálogo e a regra deverão ser verificáveis na migration; UNIQUE não depende de ID de tipo inventado.

## responsaveis
- Remover res_cpf conforme autorização P03.
- Substituir res_idade por res_data_nascimento DATE (nullable temporário por ausência na tela).
- Adicionar pes_id INT FK pessoas, NOT NULL UNIQUE. Responsável referencia a pessoa adulta, não o dependente.
- Manter res_nome e tpc_id; validar consistência com pessoa. Não preencher nascimento fictício.

## Complementos do formulário
- enderecos.end_complemento VARCHAR(100) NULL.
- enderecos.end_uf CHAR(2); obrigatório no cadastro da API e validado como UF.
- responsaveis_dependentes.rde_parentesco VARCHAR(50), sem alterar PK(res_id,pes_id).

## Relações novas
- pessoas 1 → 0..1 contas; toda conta tem exatamente uma pessoa titular.
- pessoas 1 → 0..1 responsaveis; todo responsável tem exatamente uma pessoa adulta; dependentes continuam em responsaveis_dependentes.

Data de nascimento conhecida da pessoa adulta e res_data_nascimento devem ser iguais; null transitório não permite afirmar maioridade comprovada. E-mail de acesso tem fonte única em contas; não ampliar contatos.cnt_des(30) para contornar formulário incompleto.
