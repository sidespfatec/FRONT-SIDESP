-- Execute no phpMyAdmin / SQL do XAMPP, antes de iniciar o backend.
-- Sem importar migrations à mão: o Flyway do backend executa as três em ordem.
CREATE DATABASE IF NOT EXISTS sidesp CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- Para testes de integração, crie outro banco VAZIO, separado:
-- CREATE DATABASE sidesp_test CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
