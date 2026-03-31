#!/usr/bin/env bash
# Linux VPS: install deps, build, publish PKHeX bridge, start / reload PM2.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

for cmd in node npm dotnet; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Missing required command: $cmd" >&2
    exit 1
  }
done

npm ci
npm run prod:pm2

echo ""
echo "Running: pm2 status"
pm2 status
echo ""
echo "Persist across reboots (run once per user):"
echo "  pm2 save"
echo "  pm2 startup systemd -u \"\$(whoami)\" --hp \"\$HOME\""
