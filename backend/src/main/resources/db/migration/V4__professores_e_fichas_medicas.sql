-- Cadastro profissional do professor.
-- A pessoa e a conta continuam nas tabelas existentes.
CREATE TABLE professores (
    pro_id INT NOT NULL AUTO_INCREMENT,
    pes_id INT NOT NULL,
    pro_registro_profissional VARCHAR(100) NOT NULL,
    PRIMARY KEY (pro_id),
    CONSTRAINT uq_professores_pessoa UNIQUE (pes_id),
    CONSTRAINT fk_professores_pessoa
        FOREIGN KEY (pes_id) REFERENCES pessoas(pes_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_general_ci;

-- Informações médicas complementares da pessoa.
ALTER TABLE fichas_medicas
    ADD COLUMN fim_condicoes_saude TEXT NULL,
    ADD COLUMN fim_alergias TEXT NULL,
    ADD COLUMN fim_medicamentos TEXT NULL,
    ADD COLUMN fim_contato_emergencia VARCHAR(255) NULL,
    ADD CONSTRAINT uq_fichas_medicas_pessoa UNIQUE (pes_id);