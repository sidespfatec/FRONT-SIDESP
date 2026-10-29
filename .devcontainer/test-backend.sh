#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../backend"
# Os testes de integração limpam SOMENTE o banco separado sidesp_test.
export TEST_DB_URL=jdbc:mariadb://db:3306/sidesp_test
export TEST_DB_USERNAME=sidesp
export TEST_DB_PASSWORD=sidesp-dev-only
./mvnw --batch-mode verify
