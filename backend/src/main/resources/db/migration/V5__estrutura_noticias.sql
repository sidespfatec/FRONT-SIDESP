
-- V5 - Estrutura de noticias

-- 1. Cria o novo campo de conteudo.
ALTER TABLE noticias
ADD COLUMN ntc_conteudo TEXT NULL AFTER ntc_titulo;

-- 2. Transfere o conteudo dos campos antigos.
UPDATE noticias
SET ntc_conteudo = CONCAT(
    COALESCE(ntc_conteudo_1, ''),
    CASE
        WHEN COALESCE(ntc_conteudo_1, '') <> ''
         AND COALESCE(ntc_conteudo_2, '') <> ''
        THEN '\n\n'
        ELSE ''
    END,
    COALESCE(ntc_conteudo_2, '')
);

-- 3. Torna o novo conteudo obrigatorio.
ALTER TABLE noticias
MODIFY COLUMN ntc_conteudo TEXT NOT NULL;

-- 4. Remove os campos antigos.
ALTER TABLE noticias
DROP COLUMN ntc_conteudo_1,
DROP COLUMN ntc_conteudo_2;

-- 5. Adiciona o caminho da imagem.
ALTER TABLE noticias
ADD COLUMN ntc_imagem VARCHAR(500) NULL AFTER ntc_conteudo;

-- 6. Impede nomes de status duplicados.
ALTER TABLE noticias_status
ADD CONSTRAINT uq_noticias_status_des UNIQUE (nst_des);

-- 7. Cadastra os status.
INSERT INTO noticias_status (nst_des)
VALUES
    ('EM ESPERA'),
    ('PUBLICADA'),
    ('DESPUBLICADA');
