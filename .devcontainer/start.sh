#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node .devcontainer/start.mjs
