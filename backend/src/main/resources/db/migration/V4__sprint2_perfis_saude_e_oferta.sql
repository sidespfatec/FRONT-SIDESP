-- Revoga sessões antigas quando a senha muda, sem alterar as chaves do ambiente.
ALTER TABLE contas ADD COLUMN con_versao INT NOT NULL DEFAULT 0;
-- Dados comuns complementam o cadastro sem exigir preenchimento retroativo.
ALTER TABLE pessoas ADD COLUMN pes_nome_social VARCHAR(150) NULL,
 ADD COLUMN pes_criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- Nome, nascimento e perfil do responsável passam a vir exclusivamente da pessoa vinculada.
UPDATE pessoas p JOIN responsaveis r ON r.pes_id=p.pes_id
 SET p.pes_data_nascimento=COALESCE(p.pes_data_nascimento,r.res_data_nascimento);
ALTER TABLE responsaveis DROP FOREIGN KEY fk_responsaveis_2;
ALTER TABLE responsaveis DROP COLUMN res_nome, DROP COLUMN res_data_nascimento, DROP COLUMN tpc_id;
-- Cada pessoa tem uma ficha; valores de saúde são cifrados pela aplicação.
ALTER TABLE fichas_medicas ADD COLUMN fim_condicoes VARBINARY(4096) NULL,
 ADD COLUMN fim_alergias VARBINARY(4096) NULL,
 ADD COLUMN fim_medicamentos VARBINARY(4096) NULL,
 ADD COLUMN fim_restricoes VARBINARY(4096) NULL,
 ADD COLUMN fim_emergencia_nome VARBINARY(512) NULL,
 ADD COLUMN fim_emergencia_telefone VARBINARY(512) NULL,
 ADD COLUMN fim_atualizada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 ADD CONSTRAINT uq_ficha_pessoa UNIQUE(pes_id);
-- Informações profissionais não se misturam com credenciais nem com dados de alunos.
CREATE TABLE profissionais (
 pes_id INT NOT NULL PRIMARY KEY,
 pro_registro VARCHAR(40) NULL,
 pro_especialidade VARCHAR(150) NULL,
 pro_cargo VARCHAR(100) NULL,
 pro_unidade VARCHAR(100) NULL,
 pro_admissao DATE NULL,
 pro_criado_por INT NULL,
 FOREIGN KEY(pes_id) REFERENCES pessoas(pes_id),
 FOREIGN KEY(pro_criado_por) REFERENCES contas(con_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- Guarda apenas o hash do segredo de recuperação; o token nunca fica em texto puro no banco.
CREATE TABLE recuperacoes_senha (
 rec_hash BINARY(32) NOT NULL PRIMARY KEY,
 con_id INT NOT NULL,
 rec_expira_em TIMESTAMP(6) NOT NULL,
 rec_usado_em TIMESTAMP(6) NULL,
 FOREIGN KEY(con_id) REFERENCES contas(con_id),
 INDEX ix_rec_conta(con_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- Polos são inativados, preservando turmas e histórico.
ALTER TABLE polos MODIFY pol_des VARCHAR(100) NOT NULL,
 ADD COLUMN pol_latitude DECIMAL(10,7) NULL,
 ADD COLUMN pol_longitude DECIMAL(10,7) NULL,
 ADD COLUMN pol_ativo BOOLEAN NOT NULL DEFAULT TRUE,
 ADD CONSTRAINT ck_polo_lat CHECK(pol_latitude BETWEEN -90 AND 90),
 ADD CONSTRAINT ck_polo_lng CHECK(pol_longitude BETWEEN -180 AND 180);
-- Idades e limite mensal são da modalidade; NULL preserva registros legados sem inventar valores.
ALTER TABLE modalidades MODIFY mdl_des VARCHAR(100) NOT NULL,
 ADD COLUMN mdl_idade_minima INT NULL,
 ADD COLUMN mdl_idade_maxima INT NULL,
 ADD COLUMN mdl_faltas_mensais INT NULL,
 ADD COLUMN mdl_ativo BOOLEAN NOT NULL DEFAULT TRUE,
 ADD COLUMN pol_id INT NULL,
 ADD CONSTRAINT fk_modalidade_polo FOREIGN KEY(pol_id) REFERENCES polos(pol_id),
 ADD CONSTRAINT ck_modalidade_idades CHECK(mdl_idade_minima >= 0 AND mdl_idade_maxima <= 130 AND mdl_idade_minima <= mdl_idade_maxima),
 ADD CONSTRAINT ck_modalidade_faltas CHECK(mdl_faltas_mensais >= 0);
-- A seleção pertence à turma; horários são linhas por dia para permitir turnos diferentes.
ALTER TABLE turmas ADD COLUMN trm_processo_seletivo BOOLEAN NOT NULL DEFAULT FALSE,
 ADD COLUMN trm_data_inicio DATE NULL, ADD COLUMN trm_data_fim DATE NULL,
 ADD CONSTRAINT ck_turma_datas CHECK(trm_data_fim IS NULL OR trm_data_inicio IS NULL OR trm_data_fim >= trm_data_inicio);
CREATE TABLE turmas_horarios (
 trm_id INT NOT NULL,
 tho_dia_semana TINYINT NOT NULL,
 tho_inicio TIME NOT NULL,
 tho_fim TIME NOT NULL,
 PRIMARY KEY(trm_id,tho_dia_semana,tho_inicio),
 FOREIGN KEY(trm_id) REFERENCES turmas(trm_id),
 CHECK(tho_dia_semana BETWEEN 1 AND 7), CHECK(tho_fim > tho_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
