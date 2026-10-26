#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ -f .local/codespaces/supervisor.pid ]]; then
  kill "$(cat .local/codespaces/supervisor.pid)" 2>/dev/null || true
  for attempt in {1..20}; do
    [[ -f .local/codespaces/supervisor.pid ]] || exit 0
    sleep 1
  done
  printf 'Confira os logs: o supervisor ainda não encerrou.\n' >&2
  exit 1
fi
