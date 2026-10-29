-- ESTUDO: NAO EXECUTAR, NAO IMPORTAR, NAO MOVER PARA A PASTA FLYWAY.
-- A versao executavel original permanece imutavel em backend/src/main/resources/db/migration.
-- EXPLICACAO L1: Comentário original: contextualiza a versão e não é executado pelo banco.
-- Modelo anterior aprovado: 31 tabelas. Todas as alteracoes autorizadas ficam em V2.
-- EXPLICACAO L2: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L3: Inicia a criação da tabela pessoas. Apenas o Flyway executa a versão canônica.
CREATE TABLE pessoas (
-- EXPLICACAO L4: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa. O banco gera o próximo id (AUTO_INCREMENT).
  pes_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L5: Define pes_nome como VARCHAR(150), obrigatório (NOT NULL): nome da pessoa.
  pes_nome VARCHAR(150) NOT NULL,
-- EXPLICACAO L6: Define pes_data_nascimento como DATE, opcional (NULL): data de nascimento; API exige dado válido no cadastro novo.
  pes_data_nascimento DATE NULL,
-- EXPLICACAO L7: Define pes_sexo como CHAR(1), opcional (NULL): código de gênero do modelo.
  pes_sexo CHAR(1) NULL,
-- EXPLICACAO L8: Define tpc_id como INT, obrigatório (NOT NULL): perfil/tipo de cadastro.
  tpc_id INT NOT NULL,
-- EXPLICACAO L9: Define chave primária (pes_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (pes_id)
-- EXPLICACAO L10: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L11: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L12: Inicia a criação da tabela turmas_professores_status. Apenas o Flyway executa a versão canônica.
CREATE TABLE turmas_professores_status (
-- EXPLICACAO L13: Define tpfs_id como INT, obrigatório (NOT NULL): campo tpfs_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  tpfs_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L14: Define tpfs_des como VARCHAR(13), obrigatório (NOT NULL): campo tpfs_des do modelo aprovado.
  tpfs_des VARCHAR(13) NOT NULL,
-- EXPLICACAO L15: Define chave primária (tpfs_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tpfs_id)
-- EXPLICACAO L16: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L17: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L18: Inicia a criação da tabela responsaveis. Apenas o Flyway executa a versão canônica.
CREATE TABLE responsaveis (
-- EXPLICACAO L19: Define res_id como INT, obrigatório (NOT NULL): identificador do responsável. O banco gera o próximo id (AUTO_INCREMENT).
  res_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L20: Define res_nome como VARCHAR(80), obrigatório (NOT NULL): nome do responsável.
  res_nome VARCHAR(80) NOT NULL,
-- EXPLICACAO L21: Define res_idade como INT, obrigatório (NOT NULL): campo antigo de idade, substituído por nascimento na V2.
  res_idade INT NOT NULL,
-- EXPLICACAO L22: Define res_cpf como VARCHAR(12), obrigatório (NOT NULL): campo legado de CPF, removido na V2; não usar para novos dados.
  res_cpf VARCHAR(12) NOT NULL,
-- EXPLICACAO L23: Define tpc_id como INT, obrigatório (NOT NULL): perfil/tipo de cadastro.
  tpc_id INT NOT NULL,
-- EXPLICACAO L24: Define chave primária (res_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (res_id)
-- EXPLICACAO L25: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L26: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L27: Inicia a criação da tabela contatos. Apenas o Flyway executa a versão canônica.
CREATE TABLE contatos (
-- EXPLICACAO L28: Define cnt_id como INT, obrigatório (NOT NULL): campo cnt_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  cnt_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L29: Define tct_id como INT, obrigatório (NOT NULL): campo tct_id do modelo aprovado.
  tct_id INT NOT NULL,
-- EXPLICACAO L30: Define cnt_des como VARCHAR(30), obrigatório (NOT NULL): conteúdo do contato; telefone neste fluxo.
  cnt_des VARCHAR(30) NOT NULL,
-- EXPLICACAO L31: Define pes_id como INT, opcional (NULL): identificador da pessoa.
  pes_id INT NULL,
-- EXPLICACAO L32: Define cnt_res como CHAR(1), opcional (NULL): campo cnt_res do modelo aprovado.
  cnt_res CHAR(1) NULL,
-- EXPLICACAO L33: Define res_id como INT, opcional (NULL): identificador do responsável.
  res_id INT NULL,
-- EXPLICACAO L34: Define chave primária (cnt_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (cnt_id)
-- EXPLICACAO L35: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L36: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L37: Inicia a criação da tabela tipos_contatos. Apenas o Flyway executa a versão canônica.
CREATE TABLE tipos_contatos (
-- EXPLICACAO L38: Define tct_id como INT, obrigatório (NOT NULL): campo tct_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  tct_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L39: Define tct_des como VARCHAR(20), obrigatório (NOT NULL): campo tct_des do modelo aprovado.
  tct_des VARCHAR(20) NOT NULL,
-- EXPLICACAO L40: Define chave primária (tct_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tct_id)
-- EXPLICACAO L41: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L42: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L43: Inicia a criação da tabela fichas_medicas. Apenas o Flyway executa a versão canônica.
CREATE TABLE fichas_medicas (
-- EXPLICACAO L44: Define fim_id como INT, obrigatório (NOT NULL): campo fim_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  fim_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L45: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L46: Define chave primária (fim_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (fim_id)
-- EXPLICACAO L47: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L48: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L49: Inicia a criação da tabela tipos_documentos. Apenas o Flyway executa a versão canônica.
CREATE TABLE tipos_documentos (
-- EXPLICACAO L50: Define tpd_id como INT, obrigatório (NOT NULL): campo tpd_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  tpd_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L51: Define tpd_des como VARCHAR(20), obrigatório (NOT NULL): campo tpd_des do modelo aprovado.
  tpd_des VARCHAR(20) NOT NULL,
-- EXPLICACAO L52: Define chave primária (tpd_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tpd_id)
-- EXPLICACAO L53: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L54: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L55: Inicia a criação da tabela documentos. Apenas o Flyway executa a versão canônica.
CREATE TABLE documentos (
-- EXPLICACAO L56: Define doc_id como INT, obrigatório (NOT NULL): campo doc_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  doc_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L57: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L58: Define tpd_id como INT, obrigatório (NOT NULL): campo tpd_id do modelo aprovado.
  tpd_id INT NOT NULL,
-- EXPLICACAO L59: Define doc_des como VARCHAR(20), obrigatório (NOT NULL): descrição do documento; CPF recebe apenas o rótulo CPF protegido na V2/V3.
  doc_des VARCHAR(20) NOT NULL,
-- EXPLICACAO L60: Define chave primária (doc_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (doc_id)
-- EXPLICACAO L61: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L62: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L63: Inicia a criação da tabela noticias. Apenas o Flyway executa a versão canônica.
CREATE TABLE noticias (
-- EXPLICACAO L64: Define ntc_id como INT, obrigatório (NOT NULL): campo ntc_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  ntc_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L65: Define ntc_titulo como VARCHAR(100), obrigatório (NOT NULL): campo ntc_titulo do modelo aprovado.
  ntc_titulo VARCHAR(100) NOT NULL,
-- EXPLICACAO L66: Define ntc_conteudo_1 como VARCHAR(1000), obrigatório (NOT NULL): campo ntc_conteudo_1 do modelo aprovado.
  ntc_conteudo_1 VARCHAR(1000) NOT NULL,
-- EXPLICACAO L67: Define ntc_conteudo_2 como VARCHAR(1000), opcional (NULL): campo ntc_conteudo_2 do modelo aprovado.
  ntc_conteudo_2 VARCHAR(1000) NULL,
-- EXPLICACAO L68: Define ntc_data_publicacao como TIMESTAMP, obrigatório (NOT NULL): campo ntc_data_publicacao do modelo aprovado.
  ntc_data_publicacao TIMESTAMP NOT NULL,
-- EXPLICACAO L69: Define nst_id como INT, obrigatório (NOT NULL): campo nst_id do modelo aprovado.
  nst_id INT NOT NULL,
-- EXPLICACAO L70: Define chave primária (ntc_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (ntc_id)
-- EXPLICACAO L71: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L72: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L73: Inicia a criação da tabela noticias_status. Apenas o Flyway executa a versão canônica.
CREATE TABLE noticias_status (
-- EXPLICACAO L74: Define nst_id como INT, obrigatório (NOT NULL): campo nst_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  nst_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L75: Define nst_des como VARCHAR(13), obrigatório (NOT NULL): campo nst_des do modelo aprovado.
  nst_des VARCHAR(13) NOT NULL,
-- EXPLICACAO L76: Define chave primária (nst_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (nst_id)
-- EXPLICACAO L77: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L78: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L79: Inicia a criação da tabela polos. Apenas o Flyway executa a versão canônica.
CREATE TABLE polos (
-- EXPLICACAO L80: Define pol_id como INT, obrigatório (NOT NULL): campo pol_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  pol_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L81: Define pol_des como VARCHAR(40), obrigatório (NOT NULL): descrição do polo.
  pol_des VARCHAR(40) NOT NULL,
-- EXPLICACAO L82: Define chave primária (pol_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (pol_id)
-- EXPLICACAO L83: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L84: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L85: Inicia a criação da tabela enderecos. Apenas o Flyway executa a versão canônica.
CREATE TABLE enderecos (
-- EXPLICACAO L86: Define end_id como INT, obrigatório (NOT NULL): campo end_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  end_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L87: Define end_cep como VARCHAR(10), obrigatório (NOT NULL): campo end_cep do modelo aprovado.
  end_cep VARCHAR(10) NOT NULL,
-- EXPLICACAO L88: Define end_cidade como VARCHAR(30), obrigatório (NOT NULL): campo end_cidade do modelo aprovado.
  end_cidade VARCHAR(30) NOT NULL,
-- EXPLICACAO L89: Define end_bairro como VARCHAR(40), obrigatório (NOT NULL): campo end_bairro do modelo aprovado.
  end_bairro VARCHAR(40) NOT NULL,
-- EXPLICACAO L90: Define end_rua como VARCHAR(50), obrigatório (NOT NULL): campo end_rua do modelo aprovado.
  end_rua VARCHAR(50) NOT NULL,
-- EXPLICACAO L91: Define end_numero como VARCHAR(8), obrigatório (NOT NULL): número do endereço como texto para permitir complemento numérico.
  end_numero VARCHAR(8) NOT NULL,
-- EXPLICACAO L92: Define ten_id como INT, obrigatório (NOT NULL): campo ten_id do modelo aprovado.
  ten_id INT NOT NULL,
-- EXPLICACAO L93: Define pes_id como INT, opcional (NULL): identificador da pessoa.
  pes_id INT NULL,
-- EXPLICACAO L94: Define pol_id como INT, opcional (NULL): campo pol_id do modelo aprovado.
  pol_id INT NULL,
-- EXPLICACAO L95: Define chave primária (end_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (end_id)
-- EXPLICACAO L96: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L97: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L98: Inicia a criação da tabela tipos_enderecos. Apenas o Flyway executa a versão canônica.
CREATE TABLE tipos_enderecos (
-- EXPLICACAO L99: Define ten_id como INT, obrigatório (NOT NULL): campo ten_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  ten_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L100: Define ten_des como VARCHAR(30), obrigatório (NOT NULL): campo ten_des do modelo aprovado.
  ten_des VARCHAR(30) NOT NULL,
-- EXPLICACAO L101: Define chave primária (ten_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (ten_id)
-- EXPLICACAO L102: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L103: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L104: Inicia a criação da tabela turmas. Apenas o Flyway executa a versão canônica.
CREATE TABLE turmas (
-- EXPLICACAO L105: Define trm_id como INT, obrigatório (NOT NULL): campo trm_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  trm_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L106: Define trm_nome como VARCHAR(30), obrigatório (NOT NULL): campo trm_nome do modelo aprovado.
  trm_nome VARCHAR(30) NOT NULL,
-- EXPLICACAO L107: Define mdl_id como INT, obrigatório (NOT NULL): campo mdl_id do modelo aprovado.
  mdl_id INT NOT NULL,
-- EXPLICACAO L108: Define trm_vagas como INT, obrigatório (NOT NULL): campo trm_vagas do modelo aprovado.
  trm_vagas INT NOT NULL,
-- EXPLICACAO L109: Define trm_faltas_maximas como INT, obrigatório (NOT NULL): campo trm_faltas_maximas do modelo aprovado.
  trm_faltas_maximas INT NOT NULL,
-- EXPLICACAO L110: Define tst_id como INT, obrigatório (NOT NULL): campo tst_id do modelo aprovado.
  tst_id INT NOT NULL,
-- EXPLICACAO L111: Define pol_id como INT, obrigatório (NOT NULL): campo pol_id do modelo aprovado.
  pol_id INT NOT NULL,
-- EXPLICACAO L112: Define chave primária (trm_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (trm_id)
-- EXPLICACAO L113: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L114: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L115: Inicia a criação da tabela modalidades. Apenas o Flyway executa a versão canônica.
CREATE TABLE modalidades (
-- EXPLICACAO L116: Define mdl_id como INT, obrigatório (NOT NULL): campo mdl_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  mdl_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L117: Define mdl_des como VARCHAR(30), obrigatório (NOT NULL): campo mdl_des do modelo aprovado.
  mdl_des VARCHAR(30) NOT NULL,
-- EXPLICACAO L118: Define chave primária (mdl_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (mdl_id)
-- EXPLICACAO L119: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L120: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L121: Inicia a criação da tabela inscricoes. Apenas o Flyway executa a versão canônica.
CREATE TABLE inscricoes (
-- EXPLICACAO L122: Define ins_id como INT, obrigatório (NOT NULL): campo ins_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  ins_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L123: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L124: Define trm_id como INT, obrigatório (NOT NULL): campo trm_id do modelo aprovado.
  trm_id INT NOT NULL,
-- EXPLICACAO L125: Define ins_data como DATE, obrigatório (NOT NULL): data da inscrição.
  ins_data DATE NOT NULL,
-- EXPLICACAO L126: Define sin_id como INT, obrigatório (NOT NULL): campo sin_id do modelo aprovado.
  sin_id INT NOT NULL,
-- EXPLICACAO L127: Define chave primária (ins_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (ins_id)
-- EXPLICACAO L128: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L129: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L130: Inicia a criação da tabela inscricoes_status. Apenas o Flyway executa a versão canônica.
CREATE TABLE inscricoes_status (
-- EXPLICACAO L131: Define sin_id como INT, obrigatório (NOT NULL): campo sin_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  sin_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L132: Define sin_des como VARCHAR(20), obrigatório (NOT NULL): campo sin_des do modelo aprovado.
  sin_des VARCHAR(20) NOT NULL,
-- EXPLICACAO L133: Define chave primária (sin_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (sin_id)
-- EXPLICACAO L134: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L135: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L136: Inicia a criação da tabela turmas_pessoas. Apenas o Flyway executa a versão canônica.
CREATE TABLE turmas_pessoas (
-- EXPLICACAO L137: Define tpe_id como INT, obrigatório (NOT NULL): campo tpe_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  tpe_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L138: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L139: Define trm_id como INT, obrigatório (NOT NULL): campo trm_id do modelo aprovado.
  trm_id INT NOT NULL,
-- EXPLICACAO L140: Define tps_id como INT, obrigatório (NOT NULL): campo tps_id do modelo aprovado.
  tps_id INT NOT NULL,
-- EXPLICACAO L141: Define chave primária (tpe_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tpe_id),
-- EXPLICACAO L142: Cria restrição de combinação única para integridade do vínculo/diário; não substitui a chave primária.
  UNIQUE KEY uq_tpe_pessoa_turma (tpe_id,pes_id,trm_id)
-- EXPLICACAO L143: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L144: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L145: Inicia a criação da tabela turmas_professores. Apenas o Flyway executa a versão canônica.
CREATE TABLE turmas_professores (
-- EXPLICACAO L146: Define tpf_id como INT, obrigatório (NOT NULL): campo tpf_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  tpf_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L147: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L148: Define trm_id como INT, obrigatório (NOT NULL): campo trm_id do modelo aprovado.
  trm_id INT NOT NULL,
-- EXPLICACAO L149: Define tpfs_id como INT, obrigatório (NOT NULL): campo tpfs_id do modelo aprovado.
  tpfs_id INT NOT NULL,
-- EXPLICACAO L150: Define chave primária (tpf_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tpf_id),
-- EXPLICACAO L151: Cria restrição de combinação única para integridade do vínculo/diário; não substitui a chave primária.
  UNIQUE KEY uq_tpf_turma (tpf_id,trm_id)
-- EXPLICACAO L152: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L153: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L154: Inicia a criação da tabela turmas_status. Apenas o Flyway executa a versão canônica.
CREATE TABLE turmas_status (
-- EXPLICACAO L155: Define tst_id como INT, obrigatório (NOT NULL): campo tst_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  tst_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L156: Define tst_des como VARCHAR(13), obrigatório (NOT NULL): campo tst_des do modelo aprovado.
  tst_des VARCHAR(13) NOT NULL,
-- EXPLICACAO L157: Define chave primária (tst_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tst_id)
-- EXPLICACAO L158: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L159: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L160: Inicia a criação da tabela tipos_cadastros. Apenas o Flyway executa a versão canônica.
CREATE TABLE tipos_cadastros (
-- EXPLICACAO L161: Define tpc_id como INT, obrigatório (NOT NULL): perfil/tipo de cadastro. O banco gera o próximo id (AUTO_INCREMENT).
  tpc_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L162: Define tpc_des como VARCHAR(30), obrigatório (NOT NULL): campo tpc_des do modelo aprovado.
  tpc_des VARCHAR(30) NOT NULL,
-- EXPLICACAO L163: Define chave primária (tpc_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tpc_id)
-- EXPLICACAO L164: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L165: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L166: Inicia a criação da tabela chamadas. Apenas o Flyway executa a versão canônica.
CREATE TABLE chamadas (
-- EXPLICACAO L167: Define chm_id como INT, obrigatório (NOT NULL): campo chm_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  chm_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L168: Define dia_id como INT, obrigatório (NOT NULL): campo dia_id do modelo aprovado.
  dia_id INT NOT NULL,
-- EXPLICACAO L169: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L170: Define trm_id como INT, obrigatório (NOT NULL): campo trm_id do modelo aprovado.
  trm_id INT NOT NULL,
-- EXPLICACAO L171: Define tpe_id como INT, obrigatório (NOT NULL): campo tpe_id do modelo aprovado.
  tpe_id INT NOT NULL,
-- EXPLICACAO L172: Define cst_id como INT, obrigatório (NOT NULL): campo cst_id do modelo aprovado.
  cst_id INT NOT NULL,
-- EXPLICACAO L173: Define jus_id como INT, opcional (NULL): campo jus_id do modelo aprovado.
  jus_id INT NULL,
-- EXPLICACAO L174: Define chave primária (chm_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (chm_id),
-- EXPLICACAO L175: Cria restrição de combinação única para integridade do vínculo/diário; não substitui a chave primária.
  UNIQUE KEY uq_chamada_pessoa_diario (pes_id,dia_id)
-- EXPLICACAO L176: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L177: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L178: Inicia a criação da tabela chamadas_status. Apenas o Flyway executa a versão canônica.
CREATE TABLE chamadas_status (
-- EXPLICACAO L179: Define cst_id como INT, obrigatório (NOT NULL): campo cst_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  cst_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L180: Define cst_des como VARCHAR(13), obrigatório (NOT NULL): campo cst_des do modelo aprovado.
  cst_des VARCHAR(13) NOT NULL,
-- EXPLICACAO L181: Define chave primária (cst_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (cst_id)
-- EXPLICACAO L182: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L183: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L184: Inicia a criação da tabela justificativas. Apenas o Flyway executa a versão canônica.
CREATE TABLE justificativas (
-- EXPLICACAO L185: Define jus_id como INT, obrigatório (NOT NULL): campo jus_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  jus_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L186: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L187: Define doc_id como INT, obrigatório (NOT NULL): campo doc_id do modelo aprovado.
  doc_id INT NOT NULL,
-- EXPLICACAO L188: Define jus_des como VARCHAR(20), obrigatório (NOT NULL): campo jus_des do modelo aprovado.
  jus_des VARCHAR(20) NOT NULL,
-- EXPLICACAO L189: Define jst_id como INT, obrigatório (NOT NULL): campo jst_id do modelo aprovado.
  jst_id INT NOT NULL,
-- EXPLICACAO L190: Define pes_adm_id como INT, opcional (NULL): campo pes_adm_id do modelo aprovado.
  pes_adm_id INT NULL,
-- EXPLICACAO L191: Define jus_data_falta como DATE, obrigatório (NOT NULL): campo jus_data_falta do modelo aprovado.
  jus_data_falta DATE NOT NULL,
-- EXPLICACAO L192: Define chave primária (jus_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (jus_id)
-- EXPLICACAO L193: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L194: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L195: Inicia a criação da tabela notificacoes. Apenas o Flyway executa a versão canônica.
CREATE TABLE notificacoes (
-- EXPLICACAO L196: Define not_id como INT, obrigatório (NOT NULL): campo not_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  not_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L197: Define ntp_id como INT, obrigatório (NOT NULL): campo ntp_id do modelo aprovado.
  ntp_id INT NOT NULL,
-- EXPLICACAO L198: Define not_titulo como VARCHAR(40), obrigatório (NOT NULL): campo not_titulo do modelo aprovado.
  not_titulo VARCHAR(40) NOT NULL,
-- EXPLICACAO L199: Define not_des como VARCHAR(60), obrigatório (NOT NULL): campo not_des do modelo aprovado.
  not_des VARCHAR(60) NOT NULL,
-- EXPLICACAO L200: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L201: Define not_data_envio como DATE, obrigatório (NOT NULL): campo not_data_envio do modelo aprovado.
  not_data_envio DATE NOT NULL,
-- EXPLICACAO L202: Define nfs_id como INT, obrigatório (NOT NULL): campo nfs_id do modelo aprovado.
  nfs_id INT NOT NULL,
-- EXPLICACAO L203: Define chave primária (not_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (not_id)
-- EXPLICACAO L204: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L205: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L206: Inicia a criação da tabela notificacoes_tipos. Apenas o Flyway executa a versão canônica.
CREATE TABLE notificacoes_tipos (
-- EXPLICACAO L207: Define ntp_id como INT, obrigatório (NOT NULL): campo ntp_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  ntp_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L208: Define ntp_des como VARCHAR(30), obrigatório (NOT NULL): campo ntp_des do modelo aprovado.
  ntp_des VARCHAR(30) NOT NULL,
-- EXPLICACAO L209: Define chave primária (ntp_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (ntp_id)
-- EXPLICACAO L210: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L211: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L212: Inicia a criação da tabela justificativas_situacoes. Apenas o Flyway executa a versão canônica.
CREATE TABLE justificativas_situacoes (
-- EXPLICACAO L213: Define jst_id como INT, obrigatório (NOT NULL): campo jst_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  jst_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L214: Define jst_des como VARCHAR(30), obrigatório (NOT NULL): campo jst_des do modelo aprovado.
  jst_des VARCHAR(30) NOT NULL,
-- EXPLICACAO L215: Define chave primária (jst_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (jst_id)
-- EXPLICACAO L216: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L217: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L218: Inicia a criação da tabela turmas_pessoas_status. Apenas o Flyway executa a versão canônica.
CREATE TABLE turmas_pessoas_status (
-- EXPLICACAO L219: Define tps_id como INT, obrigatório (NOT NULL): campo tps_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  tps_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L220: Define tps_des como VARCHAR(13), obrigatório (NOT NULL): campo tps_des do modelo aprovado.
  tps_des VARCHAR(13) NOT NULL,
-- EXPLICACAO L221: Define chave primária (tps_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (tps_id)
-- EXPLICACAO L222: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L223: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L224: Inicia a criação da tabela notificacoes_status. Apenas o Flyway executa a versão canônica.
CREATE TABLE notificacoes_status (
-- EXPLICACAO L225: Define nfs_id como INT, obrigatório (NOT NULL): campo nfs_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  nfs_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L226: Define nfs_des como VARCHAR(30), obrigatório (NOT NULL): campo nfs_des do modelo aprovado.
  nfs_des VARCHAR(30) NOT NULL,
-- EXPLICACAO L227: Define chave primária (nfs_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (nfs_id)
-- EXPLICACAO L228: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L229: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L230: Inicia a criação da tabela diarios. Apenas o Flyway executa a versão canônica.
CREATE TABLE diarios (
-- EXPLICACAO L231: Define dia_id como INT, obrigatório (NOT NULL): campo dia_id do modelo aprovado. O banco gera o próximo id (AUTO_INCREMENT).
  dia_id INT NOT NULL AUTO_INCREMENT,
-- EXPLICACAO L232: Define trm_id como INT, obrigatório (NOT NULL): campo trm_id do modelo aprovado.
  trm_id INT NOT NULL,
-- EXPLICACAO L233: Define tpf_id como INT, obrigatório (NOT NULL): campo tpf_id do modelo aprovado.
  tpf_id INT NOT NULL,
-- EXPLICACAO L234: Define dia_data como DATE, obrigatório (NOT NULL): campo dia_data do modelo aprovado.
  dia_data DATE NOT NULL,
-- EXPLICACAO L235: Define dia_conteudo_aula como TEXT, obrigatório (NOT NULL): conteúdo obrigatório da aula.
  dia_conteudo_aula TEXT NOT NULL,
-- EXPLICACAO L236: Define dia_observacoes como TEXT, opcional (NULL): observações opcionais do diário.
  dia_observacoes TEXT NULL,
-- EXPLICACAO L237: Define chave primária (dia_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (dia_id),
-- EXPLICACAO L238: Cria restrição de combinação única para integridade do vínculo/diário; não substitui a chave primária.
  UNIQUE KEY uq_dia_turma (dia_id,trm_id),
-- EXPLICACAO L239: Cria restrição de combinação única para integridade do vínculo/diário; não substitui a chave primária.
  UNIQUE KEY uq_turma_data (trm_id,dia_data),
-- EXPLICACAO L240: Exige que o conteúdo da aula tenha texto após remover espaços, recusando conteúdo vazio.
  CHECK (CHAR_LENGTH(TRIM(dia_conteudo_aula)) > 0)
-- EXPLICACAO L241: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L242: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L243: Inicia a criação da tabela responsaveis_dependentes. Apenas o Flyway executa a versão canônica.
CREATE TABLE responsaveis_dependentes (
-- EXPLICACAO L244: Define res_id como INT, obrigatório (NOT NULL): identificador do responsável.
  res_id INT NOT NULL,
-- EXPLICACAO L245: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L246: Define chave primária (res_id, pes_id): identifica o registro; quando composta evita repetir a mesma associação.
  PRIMARY KEY (res_id, pes_id)
-- EXPLICACAO L247: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- EXPLICACAO L248: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L249: CriaFK de pessoas(tpc_id) para tipos_cadastros(tpc_id), impedindo vínculos com registros inexistentes.
ALTER TABLE pessoas ADD CONSTRAINT fk_pessoas_1 FOREIGN KEY (tpc_id) REFERENCES tipos_cadastros (tpc_id);
-- EXPLICACAO L250: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L251: CriaFK de responsaveis(tpc_id) para tipos_cadastros(tpc_id), impedindo vínculos com registros inexistentes.
ALTER TABLE responsaveis ADD CONSTRAINT fk_responsaveis_2 FOREIGN KEY (tpc_id) REFERENCES tipos_cadastros (tpc_id);
-- EXPLICACAO L252: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L253: CriaFK de contatos(tct_id) para tipos_contatos(tct_id), impedindo vínculos com registros inexistentes.
ALTER TABLE contatos ADD CONSTRAINT fk_contatos_3 FOREIGN KEY (tct_id) REFERENCES tipos_contatos (tct_id);
-- EXPLICACAO L254: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L255: CriaFK de contatos(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE contatos ADD CONSTRAINT fk_contatos_4 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L256: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L257: CriaFK de contatos(res_id) para responsaveis(res_id), impedindo vínculos com registros inexistentes.
ALTER TABLE contatos ADD CONSTRAINT fk_contatos_5 FOREIGN KEY (res_id) REFERENCES responsaveis (res_id);
-- EXPLICACAO L258: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L259: CriaFK de fichas_medicas(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE fichas_medicas ADD CONSTRAINT fk_fichas_medicas_6 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L260: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L261: CriaFK de documentos(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE documentos ADD CONSTRAINT fk_documentos_7 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L262: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L263: CriaFK de documentos(tpd_id) para tipos_documentos(tpd_id), impedindo vínculos com registros inexistentes.
ALTER TABLE documentos ADD CONSTRAINT fk_documentos_8 FOREIGN KEY (tpd_id) REFERENCES tipos_documentos (tpd_id);
-- EXPLICACAO L264: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L265: CriaFK de noticias(nst_id) para noticias_status(nst_id), impedindo vínculos com registros inexistentes.
ALTER TABLE noticias ADD CONSTRAINT fk_noticias_9 FOREIGN KEY (nst_id) REFERENCES noticias_status (nst_id);
-- EXPLICACAO L266: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L267: CriaFK de enderecos(ten_id) para tipos_enderecos(ten_id), impedindo vínculos com registros inexistentes.
ALTER TABLE enderecos ADD CONSTRAINT fk_enderecos_10 FOREIGN KEY (ten_id) REFERENCES tipos_enderecos (ten_id);
-- EXPLICACAO L268: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L269: CriaFK de enderecos(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE enderecos ADD CONSTRAINT fk_enderecos_11 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L270: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L271: CriaFK de enderecos(pol_id) para polos(pol_id), impedindo vínculos com registros inexistentes.
ALTER TABLE enderecos ADD CONSTRAINT fk_enderecos_12 FOREIGN KEY (pol_id) REFERENCES polos (pol_id);
-- EXPLICACAO L272: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L273: CriaFK de turmas(mdl_id) para modalidades(mdl_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas ADD CONSTRAINT fk_turmas_13 FOREIGN KEY (mdl_id) REFERENCES modalidades (mdl_id);
-- EXPLICACAO L274: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L275: CriaFK de turmas(tst_id) para turmas_status(tst_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas ADD CONSTRAINT fk_turmas_14 FOREIGN KEY (tst_id) REFERENCES turmas_status (tst_id);
-- EXPLICACAO L276: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L277: CriaFK de turmas(pol_id) para polos(pol_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas ADD CONSTRAINT fk_turmas_15 FOREIGN KEY (pol_id) REFERENCES polos (pol_id);
-- EXPLICACAO L278: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L279: CriaFK de inscricoes(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE inscricoes ADD CONSTRAINT fk_inscricoes_16 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L280: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L281: CriaFK de inscricoes(trm_id) para turmas(trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE inscricoes ADD CONSTRAINT fk_inscricoes_17 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);
-- EXPLICACAO L282: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L283: CriaFK de inscricoes(sin_id) para inscricoes_status(sin_id), impedindo vínculos com registros inexistentes.
ALTER TABLE inscricoes ADD CONSTRAINT fk_inscricoes_18 FOREIGN KEY (sin_id) REFERENCES inscricoes_status (sin_id);
-- EXPLICACAO L284: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L285: CriaFK de turmas_pessoas(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas_pessoas ADD CONSTRAINT fk_turmas_pessoas_19 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L286: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L287: CriaFK de turmas_pessoas(trm_id) para turmas(trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas_pessoas ADD CONSTRAINT fk_turmas_pessoas_20 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);
-- EXPLICACAO L288: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L289: CriaFK de turmas_pessoas(tps_id) para turmas_pessoas_status(tps_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas_pessoas ADD CONSTRAINT fk_turmas_pessoas_21 FOREIGN KEY (tps_id) REFERENCES turmas_pessoas_status (tps_id);
-- EXPLICACAO L290: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L291: CriaFK de turmas_professores(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas_professores ADD CONSTRAINT fk_turmas_professores_22 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L292: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L293: CriaFK de turmas_professores(trm_id) para turmas(trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas_professores ADD CONSTRAINT fk_turmas_professores_23 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);
-- EXPLICACAO L294: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L295: CriaFK de turmas_professores(tpfs_id) para turmas_professores_status(tpfs_id), impedindo vínculos com registros inexistentes.
ALTER TABLE turmas_professores ADD CONSTRAINT fk_turmas_professores_24 FOREIGN KEY (tpfs_id) REFERENCES turmas_professores_status (tpfs_id);
-- EXPLICACAO L296: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L297: CriaFK de chamadas(dia_id,trm_id) para diarios(dia_id,trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_25 FOREIGN KEY (dia_id,trm_id) REFERENCES diarios (dia_id,trm_id);
-- EXPLICACAO L298: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L299: CriaFK de chamadas(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_26 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L300: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L301: CriaFK de chamadas(trm_id) para turmas(trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_27 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);
-- EXPLICACAO L302: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L303: CriaFK de chamadas(tpe_id,pes_id,trm_id) para turmas_pessoas(tpe_id,pes_id,trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_28 FOREIGN KEY (tpe_id,pes_id,trm_id) REFERENCES turmas_pessoas (tpe_id,pes_id,trm_id);
-- EXPLICACAO L304: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L305: CriaFK de chamadas(cst_id) para chamadas_status(cst_id), impedindo vínculos com registros inexistentes.
ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_29 FOREIGN KEY (cst_id) REFERENCES chamadas_status (cst_id);
-- EXPLICACAO L306: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L307: CriaFK de chamadas(jus_id) para justificativas(jus_id), impedindo vínculos com registros inexistentes.
ALTER TABLE chamadas ADD CONSTRAINT fk_chamadas_30 FOREIGN KEY (jus_id) REFERENCES justificativas (jus_id);
-- EXPLICACAO L308: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L309: CriaFK de justificativas(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_31 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L310: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L311: CriaFK de justificativas(doc_id) para documentos(doc_id), impedindo vínculos com registros inexistentes.
ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_32 FOREIGN KEY (doc_id) REFERENCES documentos (doc_id);
-- EXPLICACAO L312: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L313: CriaFK de justificativas(jst_id) para justificativas_situacoes(jst_id), impedindo vínculos com registros inexistentes.
ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_33 FOREIGN KEY (jst_id) REFERENCES justificativas_situacoes (jst_id);
-- EXPLICACAO L314: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L315: CriaFK de justificativas(pes_adm_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE justificativas ADD CONSTRAINT fk_justificativas_34 FOREIGN KEY (pes_adm_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L316: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L317: CriaFK de notificacoes(ntp_id) para notificacoes_tipos(ntp_id), impedindo vínculos com registros inexistentes.
ALTER TABLE notificacoes ADD CONSTRAINT fk_notificacoes_35 FOREIGN KEY (ntp_id) REFERENCES notificacoes_tipos (ntp_id);
-- EXPLICACAO L318: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L319: CriaFK de notificacoes(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE notificacoes ADD CONSTRAINT fk_notificacoes_36 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
-- EXPLICACAO L320: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L321: CriaFK de notificacoes(nfs_id) para notificacoes_status(nfs_id), impedindo vínculos com registros inexistentes.
ALTER TABLE notificacoes ADD CONSTRAINT fk_notificacoes_37 FOREIGN KEY (nfs_id) REFERENCES notificacoes_status (nfs_id);
-- EXPLICACAO L322: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L323: CriaFK de diarios(trm_id) para turmas(trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE diarios ADD CONSTRAINT fk_diarios_38 FOREIGN KEY (trm_id) REFERENCES turmas (trm_id);
-- EXPLICACAO L324: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L325: CriaFK de diarios(tpf_id,trm_id) para turmas_professores(tpf_id,trm_id), impedindo vínculos com registros inexistentes.
ALTER TABLE diarios ADD CONSTRAINT fk_diarios_39 FOREIGN KEY (tpf_id,trm_id) REFERENCES turmas_professores (tpf_id,trm_id);
-- EXPLICACAO L326: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L327: CriaFK de responsaveis_dependentes(res_id) para responsaveis(res_id), impedindo vínculos com registros inexistentes.
ALTER TABLE responsaveis_dependentes ADD CONSTRAINT fk_responsaveis_dependentes_40 FOREIGN KEY (res_id) REFERENCES responsaveis (res_id);
-- EXPLICACAO L328: Linha em branco: separa os blocos para leitura; não executa SQL.

-- EXPLICACAO L329: CriaFK de responsaveis_dependentes(pes_id) para pessoas(pes_id), impedindo vínculos com registros inexistentes.
ALTER TABLE responsaveis_dependentes ADD CONSTRAINT fk_responsaveis_dependentes_41 FOREIGN KEY (pes_id) REFERENCES pessoas (pes_id);
