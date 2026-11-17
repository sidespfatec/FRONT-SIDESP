-- Excecoes autorizadas por Heitor, revisao v0.2.
ALTER TABLE responsaveis DROP COLUMN res_cpf,
  CHANGE COLUMN res_idade res_data_nascimento DATE NULL,
  ADD COLUMN pes_id INT NOT NULL,
  ADD CONSTRAINT uq_res_pessoa UNIQUE (pes_id),
  ADD CONSTRAINT fk_res_pessoa FOREIGN KEY (pes_id) REFERENCES pessoas(pes_id);
ALTER TABLE enderecos ADD COLUMN end_complemento VARCHAR(100) NULL,
  ADD COLUMN end_uf CHAR(2) NULL;
ALTER TABLE responsaveis_dependentes ADD COLUMN rde_parentesco VARCHAR(50) NULL;
ALTER TABLE documentos ADD COLUMN doc_cpf_hash BINARY(32) NULL,
  ADD COLUMN doc_cpf_pes_id INT GENERATED ALWAYS AS
    (CASE WHEN doc_cpf_hash IS NOT NULL THEN pes_id ELSE NULL END) STORED,
  ADD CONSTRAINT uq_cpf_global UNIQUE(doc_cpf_hash),
  ADD CONSTRAINT uq_cpf_pessoa UNIQUE(doc_cpf_pes_id);
CREATE TABLE contas (
  con_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pes_id INT NOT NULL,
  con_email_criptografado VARBINARY(512) NOT NULL,
  con_email_hash BINARY(32) NOT NULL,
  con_senha_hash VARCHAR(255) NOT NULL,
  con_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT uq_conta_pessoa UNIQUE(pes_id),
  CONSTRAINT uq_conta_email UNIQUE(con_email_hash),
  CONSTRAINT fk_conta_pessoa FOREIGN KEY(pes_id) REFERENCES pessoas(pes_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
