-- ESTUDO: NAO EXECUTAR, NAO IMPORTAR, NAO MOVER PARA A PASTA FLYWAY.
-- A versao executavel original permanece imutavel em backend/src/main/resources/db/migration.
-- EXPLICACAO L1: Comentário original: contextualiza a versão e não é executado pelo banco.
-- Excecoes autorizadas por Heitor, revisao v0.2.
-- EXPLICACAO L2: Altera responsaveis e remove oCPF legado conforme autorização; CPF passa a existir somente em documentos.
ALTER TABLE responsaveis DROP COLUMN res_cpf,
-- EXPLICACAO L3: Substitui idade calculada por data de nascimento; nulabilidade transitória não dispensa validação da API.
  CHANGE COLUMN res_idade res_data_nascimento DATE NULL,
-- EXPLICACAO L4: Acrescenta pes_id: identificador da pessoa. A definição de tipo/nulabilidade segue esta instrução.
  ADD COLUMN pes_id INT NOT NULL,
-- EXPLICACAO L5: Garante uma linha de responsavel por pessoa titular usando UNIQUE(pes_id).
  ADD CONSTRAINT uq_res_pessoa UNIQUE (pes_id),
-- EXPLICACAO L6: Cria chave estrangeira: o identificador deve referenciar a pessoa/catálogo já existente.
  ADD CONSTRAINT fk_res_pessoa FOREIGN KEY (pes_id) REFERENCES pessoas(pes_id);
-- EXPLICACAO L7: Acrescenta end_complemento: complemento opcional do endereço. A definição de tipo/nulabilidade segue esta instrução.
ALTER TABLE enderecos ADD COLUMN end_complemento VARCHAR(100) NULL,
-- EXPLICACAO L8: Acrescenta end_uf: sigla da unidade federativa, validada pela API. A definição de tipo/nulabilidade segue esta instrução.
  ADD COLUMN end_uf CHAR(2) NULL;
-- EXPLICACAO L9: Acrescenta rde_parentesco: parentesco entre o responsável e o dependente. A definição de tipo/nulabilidade segue esta instrução.
ALTER TABLE responsaveis_dependentes ADD COLUMN rde_parentesco VARCHAR(50) NULL;
-- EXPLICACAO L10: Acrescenta doc_cpf_hash: HMAC do CPF,32bytes; NULL quando documento não for CPF. A definição de tipo/nulabilidade segue esta instrução.
ALTER TABLE documentos ADD COLUMN doc_cpf_hash BINARY(32) NULL,
-- EXPLICACAO L11: Acrescenta doc_cpf_pes_id: coluna gerada para limitar a umCPF por pessoa sem limitar outros tipos. A definição de tipo/nulabilidade segue esta instrução.
  ADD COLUMN doc_cpf_pes_id INT GENERATED ALWAYS AS
-- EXPLICACAO L12: Gera pes_id quando háCPFhash, ouNULL para outrodocumento; valoresNULL não colidem no índiceUNIQUE.
    (CASE WHEN doc_cpf_hash IS NOT NULL THEN pes_id ELSE NULL END) STORED,
-- EXPLICACAO L13: Índice UNIQUE global do hashCPF: duas pessoas não podem usar o mesmoCPF, inclusive em requisições simultâneas.
  ADD CONSTRAINT uq_cpf_global UNIQUE(doc_cpf_hash),
-- EXPLICACAO L14: Índice UNIQUE da pessoa apenas paraCPF: cada pessoa tem no máximo umCPF; múltiplos outros documentos continuam permitidos.
  ADD CONSTRAINT uq_cpf_pessoa UNIQUE(doc_cpf_pes_id);
-- EXPLICACAO L15: Inicia a criação da tabela contas. Apenas o Flyway executa a versão canônica.
CREATE TABLE contas (
-- EXPLICACAO L16: Define con_id como INT, obrigatório (NOT NULL): identificador da conta. O banco gera o próximo id (AUTO_INCREMENT).
  con_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
-- EXPLICACAO L17: Define pes_id como INT, obrigatório (NOT NULL): identificador da pessoa.
  pes_id INT NOT NULL,
-- EXPLICACAO L18: Define con_email_criptografado como VARBINARY(512), obrigatório (NOT NULL): envelope AES-GCM do e-mail, até512bytes.
  con_email_criptografado VARBINARY(512) NOT NULL,
-- EXPLICACAO L19: Define con_email_hash como BINARY(32), obrigatório (NOT NULL): índice HMAC-SHA-256 do e-mail normalizado.
  con_email_hash BINARY(32) NOT NULL,
-- EXPLICACAO L20: Define con_senha_hash como VARCHAR(255), obrigatório (NOT NULL): hash Argon2id, nunca senha legível.
  con_senha_hash VARCHAR(255) NOT NULL,
-- EXPLICACAO L21: Define con_ativo como BOOLEAN, obrigatório (NOT NULL): atividade da conta; conta inativa não autentica.
  con_ativo BOOLEAN NOT NULL DEFAULT TRUE,
-- EXPLICACAO L22: Restringe a uma conta por pessoa titular, sem criar conta individual para cada dependente.
  CONSTRAINT uq_conta_pessoa UNIQUE(pes_id),
-- EXPLICACAO L23: Restringe um e-mail normalizado por conta usando oHMAC, não o texto cifrado aleatório.
  CONSTRAINT uq_conta_email UNIQUE(con_email_hash),
-- EXPLICACAO L24: Cria chave estrangeira: o identificador deve referenciar a pessoa/catálogo já existente.
  CONSTRAINT fk_conta_pessoa FOREIGN KEY(pes_id) REFERENCES pessoas(pes_id)
-- EXPLICACAO L25: Finaliza a tabela: InnoDB permite transações/FKs; utf8mb4 aceita Unicode; collation define comparação textual.
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
