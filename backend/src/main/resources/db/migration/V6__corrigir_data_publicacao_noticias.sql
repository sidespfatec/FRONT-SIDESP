-- V6 - Corrige a data de publicacao das noticias

ALTER TABLE noticias
MODIFY COLUMN ntc_data_publicacao
TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;