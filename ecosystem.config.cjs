/**
 * PM2 — Linux-first production (VPS / bare metal).
 *
 * One command after clone:
 *   ./scripts/server-bootstrap.sh
 * or:
 *   npm run prod:pm2
 *
 * What runs:
 *   1) pkhex-bridge — PKHeX.Core on 127.0.0.1:5177 (not public; Node proxies to it)
 *   2) pkhex-pwa — Express + static PWA on PORT (default 3000)
 *
 * Bridge mode:
 *   If tools/pkhex-save-bridge/publish/PkhexSaveBridge.dll exists (from `npm run pkhex-bridge:publish`),
 *   PM2 runs `dotnet <dll>` — fast restarts, no `dotnet run` compile jitter.
 *   Otherwise `dotnet run --project ...` — fine for first boot / dev servers.
 *
 * Behind nginx: set env on pkhex-pwa TRUST_PROXY=1 (see app env block below).
 * Boot persistence: `pm2 save` and `pm2 startup` (systemd).
 */
const fs = require('fs');
const path = require('path');

function envFlag(...keys) {
  for (const k of keys) {
    const v = String(process.env[k] ?? '').toLowerCase();
    if (v === '1' || v === 'true') return true;
  }
  return false;
}

const root = path.resolve(__dirname);
const publishDll = path.join(root, 'tools', 'pkhex-save-bridge', 'publish', 'PkhexSaveBridge.dll');
const usePublishedBridge = fs.existsSync(publishDll);
const bridgeRelativeDll = path.join('tools', 'pkhex-save-bridge', 'publish', 'PkhexSaveBridge.dll');

const bridgeApp = {
  name: 'pkhex-bridge',
  cwd: root,
  script: 'dotnet',
  interpreter: 'none',
  instances: 1,
  exec_mode: 'fork',
  autorestart: true,
  watch: false,
  max_restarts: 40,
  exp_backoff_restart_delay: 200,
  // First `dotnet run` can compile for a long time; DLL mode is usually < 2s
  min_uptime: usePublishedBridge ? 3000 : 60000,
  kill_timeout: 15000,
  merge_logs: true,
  env: {
    DOTNET_ENVIRONMENT: 'Production',
  },
};

if (usePublishedBridge) {
  bridgeApp.args = [bridgeRelativeDll, '--urls', 'http://127.0.0.1:5177'];
} else {
  bridgeApp.args = ['run', '--project', 'tools/pkhex-save-bridge', '--urls', 'http://127.0.0.1:5177'];
}

module.exports = {
  apps: [
    bridgeApp,
    {
      name: 'pkhex-pwa',
      cwd: root,
      script: 'server.mjs',
      interpreter: 'node',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_restarts: 30,
      kill_timeout: 15000,
      merge_logs: true,
      // Start after bridge in list; PM2 starts in parallel — Express proxies once bridge listens.
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT != null && process.env.PORT !== '' ? String(process.env.PORT) : '3000',
        HOST: process.env.HOST != null && process.env.HOST !== '' ? process.env.HOST : '0.0.0.0',
        PKHEX_BRIDGE_URL:
          process.env.PKHEX_BRIDGE_URL != null && process.env.PKHEX_BRIDGE_URL !== ''
            ? process.env.PKHEX_BRIDGE_URL
            : 'http://127.0.0.1:5177',
        // Before pm2: export PKHEX_TRUST_PROXY=1 (or TRUST_PROXY=1) when nginx terminates TLS in front of Node
        TRUST_PROXY: envFlag('PKHEX_TRUST_PROXY', 'TRUST_PROXY') ? '1' : '0',
      },
    },
  ],
};
