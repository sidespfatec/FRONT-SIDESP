-- V7 - Diferencia tokens de recuperacao e primeiro acesso

ALTER TABLE recuperacoes_senha
ADD COLUMN rec_finalidade VARCHAR(20) NOT NULL
DEFAULT 'RECUPERACAO';