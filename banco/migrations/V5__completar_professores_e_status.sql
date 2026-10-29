-- Completa os dados profissionais e permite inativar sem excluir.
ALTER TABLE professores
    ADD COLUMN pro_especialidade VARCHAR(100) NOT NULL,
    ADD COLUMN pro_ativo BOOLEAN NOT NULL DEFAULT TRUE;

-- Status iniciais dos vínculos de alunos e professores com turmas.
INSERT INTO turmas_pessoas_status (tps_des)
VALUES ('ATIVO'), ('INATIVO');

INSERT INTO turmas_professores_status (tpfs_des)
VALUES ('ATIVO'), ('INATIVO');