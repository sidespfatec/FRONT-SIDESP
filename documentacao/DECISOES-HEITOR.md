> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# Decisões registradas por Heitor — 05/10/2026

Esta revisão v0.2 substitui as propostas contraditórias da v0.1. Documentação e Miro podem ser atualizados. Código/migrations ainda aguardam a revisão da versão consolidada.

## Aprovado expressamente
- Secretaria de Esportes de Guaratinguetá (P01).
- CPF canônico em documentos, associado a pessoas: no máximo um CPF por pessoa e CPF não compartilhado por pessoas distintas (P02/RN016).
- Nova tabela de contas para acesso, ligada à pessoa titular; conta do responsável acessa dependentes (P03).
- Remover responsaveis.res_cpf; CPF passa a ser localizado pelo documento da pessoa do responsável (P03).
- E-mail obrigatório (P04). O backend recusará ausência, embora o frontend atual não o colete.
- Senha mínima de oito caracteres; números e caracteres especiais não são obrigatórios (P05).
- Complementar UF/complemento do endereço e parentesco da associação (P06).
- Substituir idade do responsável por data de nascimento (P07); schema pode permanecer nullable transitório; a integração autorizada v0.3 inclui o campo e a API agora exige nascimento de adulto. Não inventar nascimento.
- Dados médicos ficam adiados (P08). Não adicionar respostas ou colunas de saúde agora; #18 não está integralmente cumprida.
- Não existe SQL/migration prévia. XAMPP informado atualizado, sem versão numérica fornecida (P09).
- Governança, consentimento e liberação de dados reais continuam dependentes de definição da Secretaria (#28/P10).
- JWT de 30 minutos sem refresh inicial (P11); persistência nas telas depende de frontend e continua fora do escopo.
- Miro como base, com detalhes físicos documentados para revisão (P12). Não alterar outras áreas.

## Especificação técnica derivada, para revisão
CPF será representado por HMAC-SHA-256 com chave secreta externa ao banco, em documentos.doc_cpf_hash. É hash protegido, não criptografia reversível. Não guardar CPF original/cifrado/mascarado em doc_des ou em contas. HMAC permite comparação e busca sem expor o CPF; hash sem segredo seria vulnerável à enumeração do espaço de CPFs. CPF completo não poderá ser recuperado/exibido após cadastro. Chave e cópias de segurança são necessárias para continuidade; perder a chave impede buscar os hashes. Rotação não pode recalcular hashes sem CPF original: exige estratégia separada, não rotação automática.

Senhas: Argon2id com salt aleatório, codificação autocontida e parâmetros mínimos OWASP (19 MiB, duas iterações, paralelismo 1), sujeito a teste de custo no ambiente. Oito caracteres contados como pontos de código Unicode, sem remover espaços, normalizar ou truncar a senha. Proposta de limite técnico: 128 caracteres, sem requisito de composição. Não usar HMAC de CPF como algoritmo de senha.

E-mail de acesso: contas.con_email_criptografado usa AES-256-GCM (nonce aleatório, tag e versão no envelope), contas.con_email_hash usa HMAC-SHA-256 para busca/unicidade. Chaves de cifragem, busca e JWT separadas fora do banco/ZIP. E-mail normalizado com trim e minúsculas para este produto, sem remover pontos ou sufixos +. Validar no máximo 254 caracteres. Não duplicar e-mail de acesso em contatos.cnt_des(30) nem ampliar essa coluna silenciosamente.

Titular: contas.pes_id UNIQUE NOT NULL referencia pessoas; responsaveis.pes_id UNIQUE NOT NULL referencia a pessoa adulta. O CPF é obtido dessa pessoa em documentos, sem cópia no responsável. responsaveis_dependentes permanece com a PK composta atual. Uma pessoa pode não ter conta (ex.: dependente); uma conta possui uma pessoa. Perfil continua em tipos_cadastros, sem novo perfil arbitrário na entrada. Catálogo RESPONSAVEL será usado conforme #17; se o adulto também for aluno, seu papel efetivo deve ser validado sem apagar vínculo de responsável.

As mudanças específicas acima são exceções autorizadas à preservação estrutural original. Fora delas, nenhum nome/PK/FK/tabela/relacionamento deve ser removido ou reorganizado.
