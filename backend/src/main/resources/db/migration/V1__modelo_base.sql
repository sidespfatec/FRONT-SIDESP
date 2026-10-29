-- Modelo anterior aprovado: 31 tabelas. Todas as alteracoes autorizadas ficam em V2.

CREATE TABLE pessoas (
  pes_id INT NOT NULL AUTO_INCREMENT,
  pes_nome VARCHAR(150) NOT NULL,
  pes_data_nascimento DATE NULL,
  pes_sexo CHAR(1) NULL,
  tpc_id INT NOT NULL,
  PRIMARY KEY (pes_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE turmas_professores_status (
  tpfs_id INT NOT NULL AUTO_INCREMENT,
  tpfs_des VARCHAR(13) NOT NULL,
  PRIMARY KEY (tpfs_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE responsaveis (
  res_id INT NOT NULL AUTO_INCREMENT,
  res_nome VARCHAR(80) NOT NULL,
  res_idade INT NOT NULL,
  res_cpf VARCHAR(12) NOT NULL,
  tpc_id INT NOT NULL,
  PRIMARY KEY (res_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE contatos (
  cnt_id INT NOT NULL AUTO_INCREMENT,
  tct_id INT NOT NULL,
  cnt_des VARCHAR(30) NOT NULL,
  pes_id INT NULL,
  cnt_res CHAR(1) NULL,
  res_id INT NULL,
  PRIMARY KEY (cnt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tipos_contatos (
  tct_id INT NOT NULL AUTO_INCREMENT,
  tct_des VARCHAR(20) NOT NULL,
  PRIMARY KEY (tct_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE fichas_medicas (
  fim_id INT NOT NULL AUTO_INCREMENT,
  pes_id INT NOT NULL,
  PRIMARY KEY (fim_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tipos_documentos (
  tpd_id INT NOT NULL AUTO_INCREMENT,
  tpd_des VARCHAR(20) NOT NULL,
  PRIMARY KEY (tpd_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE documentos (
  doc_id INT NOT NULL AUTO_INCREMENT,
  pes_id INT NOT NULL,
  tpd_id INT NOT NULL,
  doc_des VARCHAR(20) NOT NULL,
  PRIMARY KEY (doc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE noticias (
  ntc_id INT NOT NULL AUTO_INCREMENT,
  ntc_titulo VARCHAR(100) NOT NULL,
  ntc_conteudo_1 VARCHAR(1000) NOT NULL,
  ntc_conteudo_2 VARCHAR(1000) NULL,
  ntc_data_publicacao TIMESTAMP NOT NULL,
  nst_id INT NOT NULL,
  PRIMARY KEY (ntc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE noticias_status (
  nst_id INT NOT NULL AUTO_INCREMENT,
  nst_des VARCHAR(13) NOT NULL,
  PRIMARY KEY (nst_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE polos (
  pol_id INT NOT NULL AUTO_INCREMENT,
  pol_des VARCHAR(40) NOT NULL,
  PRIMARY KEY (pol_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE enderecos (
  end_id INT NOT NULL AUTO_INCREMENT,
  end_cep VARCHAR(10) NOT NULL,
  end_cidade VARCHAR(30) NOT NULL,
  end_bairro VARCHAR(40) NOT NULL,
  end_rua VARCHAR(50) NOT NULL,
  end_numero VARCHAR(8) NOT NULL,
  ten_id INT NOT NULL,
  pes_id INT NULL,
  pol_id INT NULL,
  PRIMARY KEY (end_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tipos_enderecos (
  ten_id INT NOT NULL AUTO_INCREMENT,
  ten_des VARCHAR(30) NOT NULL,
  PRIMARY KEY (ten_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE turmas (
  trm_id INT NOT NULL AUTO_INCREMENT,
  trm_nome VARCHAR(30) NOT NULL,
  mdl_id INT NOT NULL,
  trm_vagas INT NOT NULL,
  trm_faltas_maximas INT NOT NULL,
  tst_id INT NOT NULL,
  pol_id INT NOT NULL,
  PRIMARY KEY (trm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE modalidades (
  mdl_id INT NOT NULL AUTO_INCREMENT,
  mdl_des VARCHAR(30) NOT NULL,
  PRIMARY KEY (mdl_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE inscricoes (
  ins_id INT NOT NULL AUTO_INCREMENT,
  pes_id INT NOT NULL,
  trm_id INT NOT NULL,
  ins_data DATE NOT NULL,
  sin_id INT NOT NULL,
  PRIMARY KEY (ins_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE inscricoes_status (
  sin_id INT NOT NULL AUTO_INCREMENT,
  sin_des VARCHAR(20) NOT NULL,
  PRIMARY KEY (sin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE turmas_pessoas (
  tpe_id INT NOT NULL AUTO_INCREMENT,
  pes_id INT NOT NULL,
  trm_id INT NOT NULL,
  tps_id INT NOT NULL,
  PRIMARY KEY (tpe_id),
  UNIQUE KEY uq_tpe_pessoa_turma (tpe_id,pes_id,trm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE turmas_professores (
  tpf_id INT NOT NULL AUTO_INCREMENT,
  pes_id INT NOT NULL,
  trm_id INT NOT NULL,
  tpfs_id INT NOT NULL,
  PRIMARY KEY (tpf_id),
  UNIQUE KEY uq_tpf_turma (tpf_id,trm_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE turmas_status (
  tst_id INT NOT NULL AUTO_INCREMENT,
  tst_des VARCHAR(13) NOT NULL,
  PRIMARY KEY (tst_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE tipos_cadastros (
  tpc_id INT NOT NULL AUTO_INCREMENT,
  tpc_des VARCHAR(30) NOT NULL,
  PRIMARY KEY (tpc_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE chamadas (
  chm_id INT NOT NULL AUTO_INCREMENT,
  dia_id INT NOT NULL,
  pes_id INT NOT NULL,
  trm_id INT NOT NULL,
  tpe_id INT NOT NULL,
  cst_id INT NOT NULL,
  jus_id INT NULL,
  PRIMARY KEY (chm_id),
  UNIQUE KEY uq_chamada_pessoa_diario (pes_id,dia_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE chamadas_status (
  cst_id INT NOT NULL AUTO_INCREMENT,
  cst_des VARCHAR(13) NOT NULL,
  PRIMARY KEY (cst_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE justificativas (
  jus_id INT NOT NULL AUTO_INCREMENT,
  pes_id INT NOT NULL,
  doc_id INT NOT NULL,
  jus_des VARCHAR(20) NOT NULL,
  jst_id INT NOT NULL,
  pes_adm_id INT NULL,
  jus_data_falta DATE NOT NULL,
  PRIMARY KEY (jus_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE notificacoes (
  not_id INT NOT NULL AUTO_INCREMENT,
  ntp_id INT NOT NULL,
  not_titulo VARCHAR(40) NOT NULL,
  not_des VARCHAR(60) NOT NULL,
  pes_id INT NOT NULL,
  not_data_envio DATE NOT NULL,
  nfs_id INT NOT NULL,
  PRIMARY KEY (not_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE notificacoes_tipos (
  ntp_id INT NOT NULL AUTO_INCREMENT,
  ntp_des VARCHAR(30) NOT NULL,
  PRIMARY KEY (ntp_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE justificativas_situacoes (
  jst_id INT NOT NULL AUTO_INCREMENT,
  jst_des VARCHAR(30) NOT NULL,
  PRIMARY KEY (jst_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE turmas_pessoas_status (
  tps_id INT NOT NULL AUTO_INCREMENT,
  tps_des VARCHAR(13) NOT NULL,
  PRIMARY KEY (tps_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE notificacoes_status (
  nfs_id INT NOT NULL AUTO_INCREMENT,
  nfs_des VARCHAR(30) NOT NULL,
  PRIMARY KEY (nfs_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE diarios (
  dia_id INT NOT NULL AUTO_INCREMENT,
  trm_id INT NOT NULL,
  tpf_id INT NOT NULL,
  dia_data DATE NOT NULL,
  dia_conteudo_aula TEXT NOT NULL,
  dia_observacoes TEXT NULL,
  PRIMARY KEY (dia_id),
  UNIQUE KEY uq_dia_turma (dia_id,trm_id),
  UNIQUE KEY uq_turma_data (trm_id,dia_data),
  CHECK (CHAR_LENGTH(TRIM(dia_conteudo_aula)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE responsaveis_dependentes (
  res_id INT NOT NULL,
  pes_id INT NOT NULL,
  PRIMARY KEY (res_id, pes_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE pessoas ADD CONSTRAINT fk_pessoas_1 FOREIGN KEY (tpc_id) REFERENCES tipos_cadastros (tpc_id);

ALTER TABLE responsaveis ADD CONSTRAINT fk_responsaveis_2 FOREIGN KEY (tpc_id) REFERENCES tipos_cadastros (tpc_id);

ALTER TABLE contatos ADD CONSTRAINT fk_contatos_3 FOREIGN KEY (tct_id) REFERENCES tipos_contatos (tct_id);

ALTER TABLE contatos ADD CONSTRAINT fk_contatos_4 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE contatos ADD CONSTRAINT fk_contatos_5 FOREIGN KEY (res_id) REFERENCES responsaveis (res_id);

ALTER TABLE fichas_medicas ADD CONSTRAINT fk_fichas_medicas_6 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE documentos ADD CONSTRAINT fk_documentos_7 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE documentos ADD CONSTRAINT fk_documentos_8 FOREIGN KEY (tpd_id) REFERENCES tipos_documentos (tpd_id);

ALTER TABLE noticias ADD CONSTRAINT fk_noticias_9 FOREIGN KEY (nst_id) REFERENCES noticias_status (nst_id);

ALTER TABLE enderecos ADD CONSTRAINT fk_enderecos_10 FOREIGN KEY (ten_id) REFERENCES tipos_enderecos (ten_id);

ALTER TABLE enderecos ADD CONSTRAINT fk_enderecos_11 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE enderecos ADD CONSTRAINT fk_enderecos_12 FOREIGN KEY (pol_id) REFERENCES polos (pol_id);

ALTER TABLE turmas ADD CONSTRAINT fk_turmas_13 FOREIGN KEY (mdl_id) REFERENCES modalidades (mdl_id);

ALTER TABLE turmas ADD CONSTRAINT fk_turmas_14 FOREIGN KEY (tst_id) REFERENCES turmas_status (tst_id);

ALTER TABLE turmas ADD CONSTRAINT fk_turmas_15 FOREIGN KEY (pol_id) REFERENCES polos (pol_id);

ALTER TABLE inscricoes ADD CONSTRAINT fk_inscricoes_16 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE inscricoes ADD CONSTRAINT fk_inscricoes_17 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);

ALTER TABLE inscricoes ADD CONSTRAINT fk_inscricoes_18 FOREIGN KEY (sin_id) REFERENCES inscricoes_status (sin_id);

ALTER TABLE turmas_pessoas ADD CONSTRAINT fk_turmas_pessoas_19 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE turmas_pessoas ADD CONSTRAINT fk_turmas_pessoas_20 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);

ALTER TABLE turmas_pessoas ADD CONSTRAINT fk_turmas_pessoas_21 FOREIGN KEY (tps_id) REFERENCES turmas_pessoas_status (tps_id);

ALTER TABLE turmas_professores ADD CONSTRAINT fk_turmas_professores_22 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE turmas_professores ADD CONSTRAINT fk_turmas_professores_23 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);

ALTER TABLE turmas_professores ADD CONSTRAINT fk_turmas_professores_24 FOREIGN KEY (tpfs_id) REFERENCES turmas_professores_status (tpfs_id);

ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_25 FOREIGN KEY (dia_id,trm_id) REFERENCES diarios (dia_id,trm_id);

ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_26 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_27 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);

ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_28 FOREIGN KEY (tpe_id,pes_id,trm_id) REFERENCES turmas_pessoas (tpe_id,pes_id,trm_id);

ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_29 FOREIGN KEY (cst_id) REFERENCES chamadas_status (cst_id);

ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_30 FOREIGN KEY (jus_id) REFERENCES justificativas (jus_id);

ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_31 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_32 FOREIGN KEY (doc_id) REFERENCES documentos (doc_id);

ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_33 FOREIGN KEY (jst_id) REFERENCES justificativas_situacoes (jst_id);

ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_34 FOREIGN KEY (pes_adm_id) REFERENCES pessoas (pes_id);

ALTER TABLE notificacoes ADD CONSTRAINT fk_notificacoes_35 FOREIGN KEY (ntp_id) REFERENCES notificacoes_tipos (ntp_id);

ALTER TABLE notificacoes ADD CONSTRAINT fk_notificacoes_36 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);

ALTER TABLE notificacoes ADD CONSTRAINT fk_notificacoes_37 FOREIGN KEY (nfs_id) REFERENCES notificacoes_status (nfs_id);

ALTER TABLE diarios ADD CONSTRAINT fk_diarios_38 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);

ALTER TABLE diarios ADD CONSTRAINT fk_diarios_39 FOREIGN KEY (tpf_id,trm_id) REFERENCES turmas_professores (tpf_id,trm_id);

ALTER TABLE responsaveis_dependentes ADD CONSTRAINT fk_responsaveis_dependentes_40 FOREIGN KEY (res_id) REFERENCES responsaveis (res_id);

ALTER TABLE responsaveis_dependentes ADD CONSTRAINT fk_responsaveis_dependentes_41 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
