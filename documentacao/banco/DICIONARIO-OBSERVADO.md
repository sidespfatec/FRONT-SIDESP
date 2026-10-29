> Atualização v0.3: implementação autorizada por Heitor, incluindo integração Angular. IMPLEMENTACAO.md e ADR-004 registram o estado efetivo; propostas antigas abaixo são histórico quando divergirem.

# Dicionário observado no Miro

Tipos/chaves transcritos; ausência de NOT NULL não prova nulabilidade. Não é DDL aprovado. Complementos propostos estão no DATA-CARD.md.

## pessoas

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | pes_id | PK |
| varchar(150) | pes_nome |  |
| date | pes_data_nascimento |  |
| char(1) | pes_sexo |  |
| int | tpc_id | FK |

## turmas_professores_status

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tpfs_id | PK |
| varchar(13) | tpfs_des |  |

## responsaveis

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | res_id | PK |
| varchar(80) | res_nome |  |
| int | res_idade |  |
| varchar(12) | res_cpf |  |
| int | tpc_id | FK |

## contatos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | cnt_id | PK |
| int | tct_id | FK |
| varchar(30) | cnt_des |  |
| int | pes_id | FK |
| char(1) | cnt_res |  |
| int | res_id | FK |

## tipos_contatos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tct_id | PK |
| varchar(20) | tct_des |  |

## fichas_medicas

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | fim_id | PK |
| int | pes_id | FK |

## tipos_documentos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tpd_id | PK |
| varchar(20) | tpd_des |  |

## documentos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | doc_id | PK |
| int | pes_id | FK |
| int | tpd_id | FK |
| varchar(20) | doc_des |  |

## noticias

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | ntc_id | PK |
| varchar(100) | ntc_titulo |  |
| varchar(1000) | ntc_conteudo_1 |  |
| varchar(1000) | ntc_conteudo_2 |  |
| timestamp | ntc_data_publicacao |  |
| int | nst_id | FK |

## noticias_status

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | nst_id | PK |
| varchar(13) | nst_des |  |

## polos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | pol_id | PK |
| varchar(40) | pol_des |  |

## enderecos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | end_id | PK |
| varchar(10) | end_cep |  |
| varchar(30) | end_cidade |  |
| varchar(40) | end_bairro |  |
| varchar(50) | end_rua |  |
| varchar(8) | end_numero |  |
| int | ten_id | FK |
| int | pes_id | FK |
| int | pol_id | FK |

## tipos_enderecos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | ten_id | PK |
| varchar(30) | ten_des |  |

## turmas

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | trm_id | PK |
| varchar(30) | trm_nome |  |
| int | mdl_id | FK |
| int | trm_vagas |  |
| int | trm_faltas_maximas |  |
| int | tst_id | FK |
| int | pol_id | FK |

## modalidades

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | mdl_id | PK |
| varchar(30) | mdl_des |  |

## inscricoes

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | ins_id | PK |
| int | pes_id | FK |
| int | trm_id | FK |
| date | ins_data |  |
| int | sin_id | FK |

## inscricoes_status

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | sin_id | PK |
| varchar(20) | sin_des |  |

## turmas_pessoas

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tpe_id | PK |
| int | pes_id | FK |
| int | trm_id | FK |
| int | tps_id | FK |

## turmas_professores

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tpf_id | PK |
| int | pes_id | FK |
| int | trm_id | FK |
| int | tpfs_id | FK |

## turmas_status

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tst_id | PK |
| varchar(13) | tst_des |  |

## tipos_cadastros

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tpc_id | PK |
| varchar(30) | tpc_des |  |

## chamadas

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | chm_id | PK |
| int | dia_id | FK "NOT NULL" |
| int | pes_id | FK "NOT NULL" |
| int | trm_id | FK "NOT NULL" |
| int | tpe_id | FK "NOT NULL" |
| int | cst_id | FK "NOT NULL" |
| int | jus_id | FK |

## chamadas_status

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | cst_id | PK |
| varchar(13) | cst_des |  |

## justificativas

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | jus_id | PK |
| int | pes_id | FK |
| int | doc_id | FK |
| varchar(20) | jus_des |  |
| int | jst_id | FK |
| int | pes_adm_id | FK |
| date | jus_data_falta |  |

## notificacoes

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | not_id | PK |
| int | ntp_id | FK |
| varchar(40) | not_titulo |  |
| varchar(60) | not_des |  |
| int | pes_id | FK |
| date | not_data_envio |  |
| int | nfs_id | FK |

## notificacoes_tipos

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | ntp_id | PK |
| varchar(30) | ntp_des |  |

## justificativas_situacoes

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | jst_id | PK |
| varchar(30) | jst_des |  |

## turmas_pessoas_status

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | tps_id | PK |
| varchar(13) | tps_des |  |

## notificacoes_status

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | nfs_id | PK |
| varchar(30) | nfs_des |  |

## diarios

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | dia_id | PK |
| int | trm_id | FK "NOT NULL" |
| int | tpf_id | FK "NOT NULL" |
| date | dia_data | "NOT NULL" |
| text | dia_conteudo_aula | "NOT NULL" |
| text | dia_observacoes |  |

## responsaveis_dependentes

| Tipo | Coluna | Marcação observada |
|---|---|---|
| int | res_id | PK, FK "NOT NULL" |
| int | pes_id | PK, FK "NOT NULL" |
