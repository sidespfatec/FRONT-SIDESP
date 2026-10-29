> Revisão v0.4 (12/10/2026): ADR-005 e BACKEND-PARA-INICIANTES.md explicam a refatoração. Banco/contrato/regras de negócio preservados; SQL explicado separado, frontend anexado comparado e integração mantida. Estado e evidências atuais em VALIDACAO.md.

> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# Data Card — v0.2

Dados operacionais de cadastro/login, não dataset de treinamento. Decisões em DECISOES-HEITOR.md; dicionário completo de alterações em banco/DICIONARIO-REVISAO-v0.2.md. Nenhum cidadão cadastrado nesta entrega.

| Campo | Destino | Proteção/regra |
|---|---|---|
| Nome/data/gênero | pessoas.pes_nome/pes_data_nascimento/pes_sexo | Limites existentes e validação, sem inferência |
| CPF aluno/adulto | documentos.doc_cpf_hash + pes_id | HMAC de CPF normalizado; máximo um CPF por pessoa; unicidade global |
| Telefone pessoa | contatos.cnt_des, pes_id, tipo TELEFONE | Não usar senha/CPF como contato |
| Nome responsável | responsaveis.res_nome e sua pessoa em pessoas | Identidade adulta associada por responsaveis.pes_id |
| CPF responsável | documentos da pessoa adulta | Sem res_cpf, sem cópia em contas |
| Nascimento responsável | responsaveis.res_data_nascimento; pessoa quando conhecido | Schema nullable transitório; API/UI agora exigem data válida de adulto; nunca inventar data |
| Telefone responsável | contatos, res_id | Acesso por vínculo autorizado |
| Parentesco | responsaveis_dependentes.rde_parentesco | Vínculo específico; PK composta preservada |
| Endereço | enderecos, pes_id, tipo PESSOA | Campos existentes + end_uf/end_complemento autorizados |
| E-mail obrigatório | contas.con_email_criptografado/con_email_hash | AES-GCM para recuperação; HMAC para busca/unicidade |
| Senha | contas.con_senha_hash | Argon2id, mínimo oito caracteres, sem composição obrigatória |
| Confirmação senha | Não persistida | Igualdade exata, sem normalização/truncamento |
| CPFLogin das etapas | Não persistir cópia | Deve corresponder ao titular adulto adequado |
| Saúde/anamnese | Adiada | Não criar/coletar respostas; fichas_medicas mantém estrutura anterior |

Hash não é criptografia reversível; CPF não poderá ser exibido completo. HMAC é pseudonimização e continua dado pessoal. Sem CPF textual/cifrado/mascarado no banco/conta/log. Segredo HMAC separado do banco; perda da chave impede busca. Rotação demanda plano de recadastro/revalidação, sem prometer recálculo automático de hashes irreversíveis.

E-mail obrigatório ainda ausente na UI. API exige, e conta de acesso tem e-mail único. Normalizar trim/minúsculas conforme regra do produto sem remover pontos/+; formato válido e até 254 caracteres, com limite em bytes compatível com o envelope. Não duplicar em cnt_des(30). Senha contada em pontos de código Unicode; mínimo 8, limite técnico proposto 128; espaços preservados.

Finalidade, base legal, termos, retenção, descarte e acesso/auditoria de saúde aguardam Secretaria/PO (#28). Confirmação P10 mantém esse trabalho futuro; não significa conformidade concluída. Apenas dados sintéticos nos testes/IA; nunca dumps reais.
