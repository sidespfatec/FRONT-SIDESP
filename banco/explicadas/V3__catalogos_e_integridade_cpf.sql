-- ESTUDO: NAO EXECUTAR, NAO IMPORTAR, NAO MOVER PARA A PASTA FLYWAY.
-- A versao executavel original permanece imutavel em backend/src/main/resources/db/migration.
-- EXPLICACAO L1: Inicia carga do catálogo tipos_cadastros, com ids/textos técnicos fixos; não cria cidadãos ou senhas.
INSERT INTO tipos_cadastros(tpc_id,tpc_des) VALUES
-- EXPLICACAO L2: Define os perfis iniciais e seus ids estáveis; cadastro público só usa ALUNO/RESPONSAVEL, sem criar administrador.
 (1,'ADMINISTRADOR_TOTAL'),(2,'ADMINISTRADOR_PARCIAL'),(3,'PROFESSOR'),(4,'ALUNO'),(5,'RESPONSAVEL');
-- EXPLICACAO L3: Inicia carga do catálogo tipos_documentos, com ids/textos técnicos fixos; não cria cidadãos ou senhas.
INSERT INTO tipos_documentos(tpd_id,tpd_des) VALUES (1,'CPF'),(2,'RG');
-- EXPLICACAO L4: Inicia carga do catálogo tipos_contatos, com ids/textos técnicos fixos; não cria cidadãos ou senhas.
INSERT INTO tipos_contatos(tct_id,tct_des) VALUES (1,'TELEFONE'),(2,'EMAIL');
-- EXPLICACAO L5: Inicia carga do catálogo tipos_enderecos, com ids/textos técnicos fixos; não cria cidadãos ou senhas.
INSERT INTO tipos_enderecos(ten_id,ten_des) VALUES (1,'PESSOA'),(2,'POLOS');
-- EXPLICACAO L6: Comentário original: contextualiza a versão e não é executado pelo banco.
-- Nao criar cidadaos ou credenciais de administracao em migrations.
-- EXPLICACAO L7: Troca delimitador do script para$$: permite vários comandos dentro de umtrigger sem encerrar cedo.
DELIMITER $$
-- EXPLICACAO L8: Cria trigger tr_documento_cpf_insert, executado antes de cadaINSERT/UPDATE/DELETE na tabela indicada.
CREATE TRIGGER tr_documento_cpf_insert BEFORE INSERT ON documentos FOR EACH ROW
-- EXPLICACAO L9: Abre o bloco de instruções do trigger.
BEGIN
-- EXPLICACAO L10: Declara variável localtipo para consultar a descrição do tipo de documento.
 DECLARE tipo VARCHAR(20);
-- EXPLICACAO L11: Busca o catálogo do tipo usado no registroNEW e guarda sua descrição na variáveltipo.
 SELECT tpd_des INTO tipo FROM tipos_documentos WHERE tpd_id=NEW.tpd_id;
-- EXPLICACAO L12: DetectaCPF semhash ou com descrição diferente do rótulo protegido; CPF em texto puro não é permitido.
 IF (tipo='CPF' AND (NEW.doc_cpf_hash IS NULL OR NEW.doc_des <> 'CPF protegido'))
-- EXPLICACAO L13: Também detecta hashCPF colocado em tipo nãoCPF; THEN inicia a rejeição quando qualquer condição ocorrer.
    OR (tipo <> 'CPF' AND NEW.doc_cpf_hash IS NOT NULL) THEN
-- EXPLICACAO L14: Lança erroSQL de negócio45000 com mensagem controlada; cancela a operação que violaria integridade.
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Tipo CPF e hash devem ser coerentes';
-- EXPLICACAO L15: Encerra a condição do trigger.
 END IF;
-- EXPLICACAO L16: Encerra o trigger e sua declaração usando o delimitador$$.
END$$
-- EXPLICACAO L17: Cria trigger tr_documento_cpf_update, executado antes de cadaINSERT/UPDATE/DELETE na tabela indicada.
CREATE TRIGGER tr_documento_cpf_update BEFORE UPDATE ON documentos FOR EACH ROW
-- EXPLICACAO L18: Abre o bloco de instruções do trigger.
BEGIN
-- EXPLICACAO L19: Declara variável localtipo para consultar a descrição do tipo de documento.
 DECLARE tipo VARCHAR(20);
-- EXPLICACAO L20: Busca o catálogo do tipo usado no registroNEW e guarda sua descrição na variáveltipo.
 SELECT tpd_des INTO tipo FROM tipos_documentos WHERE tpd_id=NEW.tpd_id;
-- EXPLICACAO L21: DetectaCPF semhash ou com descrição diferente do rótulo protegido; CPF em texto puro não é permitido.
 IF (tipo='CPF' AND (NEW.doc_cpf_hash IS NULL OR NEW.doc_des <> 'CPF protegido'))
-- EXPLICACAO L22: Também detecta hashCPF colocado em tipo nãoCPF; THEN inicia a rejeição quando qualquer condição ocorrer.
    OR (tipo <> 'CPF' AND NEW.doc_cpf_hash IS NOT NULL) THEN
-- EXPLICACAO L23: Lança erroSQL de negócio45000 com mensagem controlada; cancela a operação que violaria integridade.
   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Tipo CPF e hash devem ser coerentes';
-- EXPLICACAO L24: Encerra a condição do trigger.
 END IF;
-- EXPLICACAO L25: Encerra o trigger e sua declaração usando o delimitador$$.
END$$
-- EXPLICACAO L26: Cria trigger tr_tipo_cpf_update, executado antes de cadaINSERT/UPDATE/DELETE na tabela indicada.
CREATE TRIGGER tr_tipo_cpf_update BEFORE UPDATE ON tipos_documentos FOR EACH ROW
-- EXPLICACAO L27: Abre o bloco de instruções do trigger.
BEGIN
-- EXPLICACAO L28: Bloqueia mudar o tipoCPF existente ou transformar outrotipo emCPF; catálogo só muda com decisão/migration revisada.
 IF OLD.tpd_des='CPF' OR NEW.tpd_des='CPF' THEN
-- EXPLICACAO L29: Lança erroSQL de negócio45000 com mensagem controlada; cancela a operação que violaria integridade.
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Catalogo CPF somente muda por migration revisada';
-- EXPLICACAO L30: Encerra a condição do trigger.
 END IF;
-- EXPLICACAO L31: Encerra o trigger e sua declaração usando o delimitador$$.
END$$
-- EXPLICACAO L32: Cria trigger tr_tipo_cpf_delete, executado antes de cadaINSERT/UPDATE/DELETE na tabela indicada.
CREATE TRIGGER tr_tipo_cpf_delete BEFORE DELETE ON tipos_documentos FOR EACH ROW
-- EXPLICACAO L33: Abre o bloco de instruções do trigger.
BEGIN
-- EXPLICACAO L34: Detecta tentativa de apagar o catálogoCPF usado pelas restrições de integridade.
 IF OLD.tpd_des='CPF' THEN
-- EXPLICACAO L35: Lança erroSQL de negócio45000 com mensagem controlada; cancela a operação que violaria integridade.
  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Catalogo CPF nao pode ser removido';
-- EXPLICACAO L36: Encerra a condição do trigger.
 END IF;
-- EXPLICACAO L37: Encerra o trigger e sua declaração usando o delimitador$$.
END$$
-- EXPLICACAO L38: Restaura o delimitador padrão ao terminar os triggers.
DELIMITER ;
