-- MATERIAL DE LEITURA. NÃO EXECUTAR. O Flyway usa backend/src/main/resources/db/migration.
-- Revoga sessões antigas quando a senha muda, sem alterar as chaves do ambiente.
-- Acrescenta o campo con_versao.
ALTER TABLE contas ADD COLUMN con_versao INT NOT NULL DEFAULT 0;
-- Dados comuns complementam o cadastro sem exigir preenchimento retroativo.
-- Acrescenta o campo pes_nome_social.
ALTER TABLE pessoas ADD COLUMN pes_nome_social VARCHAR(150) NULL,
-- Acrescenta o campo pes_criado_em.
 ADD COLUMN pes_criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
-- Nome, nascimento e perfil do responsável passam a vir exclusivamente da pessoa vinculada.
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
UPDATE pessoas p JOIN responsaveis r ON r.pes_id=p.pes_id
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 SET p.pes_data_nascimento=COALESCE(p.pes_data_nascimento,r.res_data_nascimento);
-- Exige que o registro referenciado exista antes de gravar este vínculo.
ALTER TABLE responsaveis DROP FOREIGN KEY fk_responsaveis_2;
-- Remove dados redundantes do responsável depois de preservar a informação na pessoa.
ALTER TABLE responsaveis DROP COLUMN res_nome, DROP COLUMN res_data_nascimento, DROP COLUMN tpc_id;
-- Cada pessoa tem uma ficha; valores de saúde são cifrados pela aplicação.
-- Acrescenta o campo fim_condicoes.
ALTER TABLE fichas_medicas ADD COLUMN fim_condicoes VARBINARY(4096) NULL,
-- Acrescenta o campo fim_alergias.
 ADD COLUMN fim_alergias VARBINARY(4096) NULL,
-- Acrescenta o campo fim_medicamentos.
 ADD COLUMN fim_medicamentos VARBINARY(4096) NULL,
-- Acrescenta o campo fim_restricoes.
 ADD COLUMN fim_restricoes VARBINARY(4096) NULL,
-- Acrescenta o campo fim_emergencia_nome.
 ADD COLUMN fim_emergencia_nome VARBINARY(512) NULL,
-- Acrescenta o campo fim_emergencia_telefone.
 ADD COLUMN fim_emergencia_telefone VARBINARY(512) NULL,
-- Acrescenta o campo fim_atualizada_em.
 ADD COLUMN fim_atualizada_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 ADD CONSTRAINT uq_ficha_pessoa UNIQUE(pes_id);
-- Informações profissionais não se misturam com credenciais nem com dados de alunos.
-- Cria a tabela profissionais com as chaves descritas nas próximas linhas.
CREATE TABLE profissionais (
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 pes_id INT NOT NULL PRIMARY KEY,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 pro_registro VARCHAR(40) NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 pro_especialidade VARCHAR(150) NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 pro_cargo VARCHAR(100) NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 pro_unidade VARCHAR(100) NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 pro_admissao DATE NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 pro_criado_por INT NULL,
-- Exige que o registro referenciado exista antes de gravar este vínculo.
 FOREIGN KEY(pes_id) REFERENCES pessoas(pes_id),
-- Exige que o registro referenciado exista antes de gravar este vínculo.
 FOREIGN KEY(pro_criado_por) REFERENCES contas(con_id)
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- Guarda apenas o hash do segredo de recuperação; o token nunca fica em texto puro no banco.
-- Cria a tabela recuperacoes_senha com as chaves descritas nas próximas linhas.
CREATE TABLE recuperacoes_senha (
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 rec_hash BINARY(32) NOT NULL PRIMARY KEY,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 con_id INT NOT NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 rec_expira_em TIMESTAMP(6) NOT NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 rec_usado_em TIMESTAMP(6) NULL,
-- Exige que o registro referenciado exista antes de gravar este vínculo.
 FOREIGN KEY(con_id) REFERENCES contas(con_id),
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 INDEX ix_rec_conta(con_id)
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- Polos são inativados, preservando turmas e histórico.
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
ALTER TABLE polos MODIFY pol_des VARCHAR(100) NOT NULL,
-- Acrescenta o campo pol_latitude.
 ADD COLUMN pol_latitude DECIMAL(10,7) NULL,
-- Acrescenta o campo pol_longitude.
 ADD COLUMN pol_longitude DECIMAL(10,7) NULL,
-- Acrescenta o campo pol_ativo.
 ADD COLUMN pol_ativo BOOLEAN NOT NULL DEFAULT TRUE,
-- Confere a faixa ou a ordem dos valores também no banco.
 ADD CONSTRAINT ck_polo_lat CHECK(pol_latitude BETWEEN -90 AND 90),
-- Confere a faixa ou a ordem dos valores também no banco.
 ADD CONSTRAINT ck_polo_lng CHECK(pol_longitude BETWEEN -180 AND 180);
-- Idades e limite mensal são da modalidade; NULL preserva registros legados sem inventar valores.
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
ALTER TABLE modalidades MODIFY mdl_des VARCHAR(100) NOT NULL,
-- Acrescenta o campo mdl_idade_minima.
 ADD COLUMN mdl_idade_minima INT NULL,
-- Acrescenta o campo mdl_idade_maxima.
 ADD COLUMN mdl_idade_maxima INT NULL,
-- Acrescenta o campo mdl_faltas_mensais.
 ADD COLUMN mdl_faltas_mensais INT NULL,
-- Acrescenta o campo mdl_ativo.
 ADD COLUMN mdl_ativo BOOLEAN NOT NULL DEFAULT TRUE,
-- Acrescenta o campo pol_id.
 ADD COLUMN pol_id INT NULL,
-- Exige que o registro referenciado exista antes de gravar este vínculo.
 ADD CONSTRAINT fk_modalidade_polo FOREIGN KEY(pol_id) REFERENCES polos(pol_id),
-- Confere a faixa ou a ordem dos valores também no banco.
 ADD CONSTRAINT ck_modalidade_idades CHECK(mdl_idade_minima >= 0 AND mdl_idade_maxima <= 130 AND mdl_idade_minima <= mdl_idade_maxima),
-- Confere a faixa ou a ordem dos valores também no banco.
 ADD CONSTRAINT ck_modalidade_faltas CHECK(mdl_faltas_mensais >= 0);
-- A seleção pertence à turma; horários são linhas por dia para permitir turnos diferentes.
-- Acrescenta o campo trm_processo_seletivo.
ALTER TABLE turmas ADD COLUMN trm_processo_seletivo BOOLEAN NOT NULL DEFAULT FALSE,
-- Acrescenta o campo trm_data_inicio.
 ADD COLUMN trm_data_inicio DATE NULL, ADD COLUMN trm_data_fim DATE NULL,
-- Confere a faixa ou a ordem dos valores também no banco.
 ADD CONSTRAINT ck_turma_datas CHECK(trm_data_fim IS NULL OR trm_data_inicio IS NULL OR trm_data_fim >= trm_data_inicio);
-- Cria a tabela turmas_horarios com as chaves descritas nas próximas linhas.
CREATE TABLE turmas_horarios (
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 trm_id INT NOT NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 tho_dia_semana TINYINT NOT NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 tho_inicio TIME NOT NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 tho_fim TIME NOT NULL,
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
 PRIMARY KEY(trm_id,tho_dia_semana,tho_inicio),
-- Exige que o registro referenciado exista antes de gravar este vínculo.
 FOREIGN KEY(trm_id) REFERENCES turmas(trm_id),
-- Confere a faixa ou a ordem dos valores também no banco.
 CHECK(tho_dia_semana BETWEEN 1 AND 7), CHECK(tho_fim > tho_inicio)
-- Completa a definição SQL iniciada acima; consulte a finalidade no comentário do bloco.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
