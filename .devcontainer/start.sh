#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p .local/codespaces
if [[ -f .local/codespaces/supervisor.pid ]] && kill -0 "$(cat .local/codespaces/supervisor.pid)" 2>/dev/null; then
  printf 'SIDESP já está iniciado. Logs: .local/codespaces/\n'
  exit 0
fi
nohup node .devcontainer/run.mjs > .local/codespaces/supervisor.log 2>&1 < /dev/null &
echo "$!" > .local/codespaces/supervisor.pid
printf 'SIDESP iniciando. Abra a porta 4200 quando a compilação terminar.\nLogs: .local/codespaces/frontend.log e backend.log\n'
