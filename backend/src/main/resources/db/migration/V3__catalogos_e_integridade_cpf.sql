INSERT INTO tipos_cadastros(tpc_id,tpc_des) VALUES
 (1,'ADMINISTRADOR_TOTAL'),(2,'ADMINISTRADOR_PARCIAL'),(3,'PROFESSOR'),(4,'ALUNO'),(5,'RESPONSAVEL');
INSERT INTO tipos_documentos(tpd_id,tpd_des) VALUES (1,'CPF'),(2,'RG');
INSERT INTO tipos_contatos(tct_id,tct_des) VALUES (1,'TELEFONE'),(2,'EMAIL');
INSERT INTO tipos_enderecos(ten_id,ten_des) VALUES (1,'PESSOA'),(2,'POLOS');
-- Nao criar cidadaos ou credenciais de administracao em migrations.
DELIMITER $$
CREATE TRIGGER tr_documento_cpf_insert BEFORE INSERT ON documentos FOR EACH ROW
BEGIN
 DECLARE tipo VARCHAR(20);
 SELECT tpd_des INTO tipo FROM tipos_documentos WHERE tpd_id=NEW.tpd_id;
 IF (tipo='CPF' AND (NEW.doc_cpf_hash IS NULL OR NEW.doc_des <> 'CPF protegido'))
    OR (tipo <> 'CPF' AND NEW.doc_cpf_hash IS NOT NULL) THEN
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Tipo CPF e hash devem ser coerentes';
 END IF;
END$$
CREATE TRIGGER tr_documento_cpf_update BEFORE UPDATE ON documentos FOR EACH ROW
BEGIN
 DECLARE tipo VARCHAR(20);
 SELECT tpd_des INTO tipo FROM tipos_documentos WHERE tpd_id=NEW.tpd_id;
 IF (tipo='CPF' AND (NEW.doc_cpf_hash IS NULL OR NEW.doc_des <> 'CPF protegido'))
    OR (tipo <> 'CPF' AND NEW.doc_cpf_hash IS NOT NULL) THEN
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Tipo CPF e hash devem ser coerentes';
 END IF;
END$$
CREATE TRIGGER tr_tipo_cpf_update BEFORE UPDATE ON tipos_documentos FOR EACH ROW
BEGIN
 IF OLD.tpd_des='CPF' OR NEW.tpd_des='CPF' THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Catalogo CPF somente muda por migration revisada';
 END IF;
END$$
CREATE TRIGGER tr_tipo_cpf_delete BEFORE DELETE ON tipos_documentos FOR EACH ROW
BEGIN
 IF OLD.tpd_des='CPF' THEN
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Catalogo CPF nao pode ser removido';
 END IF;
END$$
DELIMITER ;
