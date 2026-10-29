# Dicionário do banco V4

Extraído do banco de teste após aplicar as migrations V1 a V4. Os campos legados permanecem, salvo as redundâncias do responsável removidas na V4.

## chamadas

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| chm_id | int(11) | NO | — | PRI |
| dia_id | int(11) | NO | — | MUL |
| pes_id | int(11) | NO | — | MUL |
| trm_id | int(11) | NO | — | MUL |
| tpe_id | int(11) | NO | — | MUL |
| cst_id | int(11) | NO | — | MUL |
| jus_id | int(11) | YES | NULL | MUL |

## chamadas_status

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| cst_id | int(11) | NO | — | PRI |
| cst_des | varchar(13) | NO | — |  |

## contas

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| con_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | UNI |
| con_email_criptografado | varbinary(512) | NO | — |  |
| con_email_hash | binary(32) | NO | — | UNI |
| con_senha_hash | varchar(255) | NO | — |  |
| con_ativo | tinyint(1) | NO | 1 |  |
| con_versao | int(11) | NO | 0 |  |

## contatos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| cnt_id | int(11) | NO | — | PRI |
| tct_id | int(11) | NO | — | MUL |
| cnt_des | varchar(30) | NO | — |  |
| pes_id | int(11) | YES | NULL | MUL |
| cnt_res | char(1) | YES | NULL |  |
| res_id | int(11) | YES | NULL | MUL |

## diarios

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| dia_id | int(11) | NO | — | PRI |
| trm_id | int(11) | NO | — | MUL |
| tpf_id | int(11) | NO | — | MUL |
| dia_data | date | NO | — |  |
| dia_conteudo_aula | text | NO | — |  |
| dia_observacoes | text | YES | NULL |  |

## documentos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| doc_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | MUL |
| tpd_id | int(11) | NO | — | MUL |
| doc_des | varchar(20) | NO | — |  |
| doc_cpf_hash | binary(32) | YES | NULL | UNI |
| doc_cpf_pes_id | int(11) | YES | NULL | UNI |

## enderecos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| end_id | int(11) | NO | — | PRI |
| end_cep | varchar(10) | NO | — |  |
| end_cidade | varchar(30) | NO | — |  |
| end_bairro | varchar(40) | NO | — |  |
| end_rua | varchar(50) | NO | — |  |
| end_numero | varchar(8) | NO | — |  |
| ten_id | int(11) | NO | — | MUL |
| pes_id | int(11) | YES | NULL | MUL |
| pol_id | int(11) | YES | NULL | MUL |
| end_complemento | varchar(100) | YES | NULL |  |
| end_uf | char(2) | YES | NULL |  |

## fichas_medicas

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| fim_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | UNI |
| fim_condicoes | varbinary(4096) | YES | NULL |  |
| fim_alergias | varbinary(4096) | YES | NULL |  |
| fim_medicamentos | varbinary(4096) | YES | NULL |  |
| fim_restricoes | varbinary(4096) | YES | NULL |  |
| fim_emergencia_nome | varbinary(512) | YES | NULL |  |
| fim_emergencia_telefone | varbinary(512) | YES | NULL |  |
| fim_atualizada_em | timestamp | NO | current_timestamp() |  |

## inscricoes

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| ins_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | MUL |
| trm_id | int(11) | NO | — | MUL |
| ins_data | date | NO | — |  |
| sin_id | int(11) | NO | — | MUL |

## inscricoes_status

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| sin_id | int(11) | NO | — | PRI |
| sin_des | varchar(20) | NO | — |  |

## justificativas

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| jus_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | MUL |
| doc_id | int(11) | NO | — | MUL |
| jus_des | varchar(20) | NO | — |  |
| jst_id | int(11) | NO | — | MUL |
| pes_adm_id | int(11) | YES | NULL | MUL |
| jus_data_falta | date | NO | — |  |

## justificativas_situacoes

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| jst_id | int(11) | NO | — | PRI |
| jst_des | varchar(30) | NO | — |  |

## modalidades

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| mdl_id | int(11) | NO | — | PRI |
| mdl_des | varchar(100) | NO | — |  |
| mdl_idade_minima | int(11) | YES | NULL |  |
| mdl_idade_maxima | int(11) | YES | NULL |  |
| mdl_faltas_mensais | int(11) | YES | NULL |  |
| mdl_ativo | tinyint(1) | NO | 1 |  |
| pol_id | int(11) | YES | NULL | MUL |

## noticias

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| ntc_id | int(11) | NO | — | PRI |
| ntc_titulo | varchar(100) | NO | — |  |
| ntc_conteudo_1 | varchar(1000) | NO | — |  |
| ntc_conteudo_2 | varchar(1000) | YES | NULL |  |
| ntc_data_publicacao | timestamp | NO | — |  |
| nst_id | int(11) | NO | — | MUL |

## noticias_status

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| nst_id | int(11) | NO | — | PRI |
| nst_des | varchar(13) | NO | — |  |

## notificacoes

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| not_id | int(11) | NO | — | PRI |
| ntp_id | int(11) | NO | — | MUL |
| not_titulo | varchar(40) | NO | — |  |
| not_des | varchar(60) | NO | — |  |
| pes_id | int(11) | NO | — | MUL |
| not_data_envio | date | NO | — |  |
| nfs_id | int(11) | NO | — | MUL |

## notificacoes_status

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| nfs_id | int(11) | NO | — | PRI |
| nfs_des | varchar(30) | NO | — |  |

## notificacoes_tipos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| ntp_id | int(11) | NO | — | PRI |
| ntp_des | varchar(30) | NO | — |  |

## pessoas

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| pes_id | int(11) | NO | — | PRI |
| pes_nome | varchar(150) | NO | — |  |
| pes_data_nascimento | date | YES | NULL |  |
| pes_sexo | char(1) | YES | NULL |  |
| tpc_id | int(11) | NO | — | MUL |
| pes_nome_social | varchar(150) | YES | NULL |  |
| pes_criado_em | timestamp | NO | current_timestamp() |  |

## polos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| pol_id | int(11) | NO | — | PRI |
| pol_des | varchar(100) | NO | — |  |
| pol_latitude | decimal(10,7) | YES | NULL |  |
| pol_longitude | decimal(10,7) | YES | NULL |  |
| pol_ativo | tinyint(1) | NO | 1 |  |

## profissionais

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| pes_id | int(11) | NO | — | PRI |
| pro_registro | varchar(40) | YES | NULL |  |
| pro_especialidade | varchar(150) | YES | NULL |  |
| pro_cargo | varchar(100) | YES | NULL |  |
| pro_unidade | varchar(100) | YES | NULL |  |
| pro_admissao | date | YES | NULL |  |
| pro_criado_por | int(11) | YES | NULL | MUL |

## recuperacoes_senha

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| rec_hash | binary(32) | NO | — | PRI |
| con_id | int(11) | NO | — | MUL |
| rec_expira_em | timestamp(6) | NO | — |  |
| rec_usado_em | timestamp(6) | YES | NULL |  |

## responsaveis

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| res_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | UNI |

## responsaveis_dependentes

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| res_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | PRI |
| rde_parentesco | varchar(50) | YES | NULL |  |

## tipos_cadastros

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tpc_id | int(11) | NO | — | PRI |
| tpc_des | varchar(30) | NO | — |  |

## tipos_contatos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tct_id | int(11) | NO | — | PRI |
| tct_des | varchar(20) | NO | — |  |

## tipos_documentos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tpd_id | int(11) | NO | — | PRI |
| tpd_des | varchar(20) | NO | — |  |

## tipos_enderecos

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| ten_id | int(11) | NO | — | PRI |
| ten_des | varchar(30) | NO | — |  |

## turmas

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| trm_id | int(11) | NO | — | PRI |
| trm_nome | varchar(30) | NO | — |  |
| mdl_id | int(11) | NO | — | MUL |
| trm_vagas | int(11) | NO | — |  |
| trm_faltas_maximas | int(11) | NO | — |  |
| tst_id | int(11) | NO | — | MUL |
| pol_id | int(11) | NO | — | MUL |
| trm_processo_seletivo | tinyint(1) | NO | 0 |  |
| trm_data_inicio | date | YES | NULL |  |
| trm_data_fim | date | YES | NULL |  |

## turmas_horarios

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| trm_id | int(11) | NO | — | PRI |
| tho_dia_semana | tinyint(4) | NO | — | PRI |
| tho_inicio | time | NO | — | PRI |
| tho_fim | time | NO | — |  |

## turmas_pessoas

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tpe_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | MUL |
| trm_id | int(11) | NO | — | MUL |
| tps_id | int(11) | NO | — | MUL |

## turmas_pessoas_status

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tps_id | int(11) | NO | — | PRI |
| tps_des | varchar(13) | NO | — |  |

## turmas_professores

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tpf_id | int(11) | NO | — | PRI |
| pes_id | int(11) | NO | — | MUL |
| trm_id | int(11) | NO | — | MUL |
| tpfs_id | int(11) | NO | — | MUL |

## turmas_professores_status

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tpfs_id | int(11) | NO | — | PRI |
| tpfs_des | varchar(13) | NO | — |  |

## turmas_status

| Campo | Tipo | Nulo | Padrão | Chave |
|---|---|---|---|---|
| tst_id | int(11) | NO | — | PRI |
| tst_des | varchar(13) | NO | — |  |

