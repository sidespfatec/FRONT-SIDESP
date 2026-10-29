#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node .devcontainer/setup.mjs
sudo chown -R "$(id -u):$(id -g)" "$HOME/.m2"
chmod +x backend/mvnw
npm ci
(cd backend && ./mvnw --batch-mode -DskipTests package)
printf '\nAmbiente instalado. Iniciar: bash .devcontainer/start.sh\n'
