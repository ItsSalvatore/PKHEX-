import express from 'express';
import compression from 'compression';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = join(__dirname, 'apps', 'web', 'dist');
const PKHEX_BRIDGE_URL = process.env.PKHEX_BRIDGE_URL || 'http://127.0.0.1:5177';

if (process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

if (!existsSync(DIST_DIR)) {
  console.error(`Build directory not found: ${DIST_DIR}`);
  console.error('Run "npm run build" first.');
  process.exit(1);
}

app.use(compression());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(
  '/api/pkhex-parse',
  createProxyMiddleware({
    target: PKHEX_BRIDGE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/pkhex-parse': '/parse' },
    logLevel: 'warn',
  }),
);

app.use('/api/pkhex-bridge-health', createProxyMiddleware({
  target: PKHEX_BRIDGE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/pkhex-bridge-health': '/health' },
  logLevel: 'silent',
}));

app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  immutable: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
    const base = basename(filePath);
    if (base === 'sw.js' || base.startsWith('workbox-')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.get('*', (_req, res) => {
  res.sendFile(join(DIST_DIR, 'index.html'));
});

const server = app.listen(PORT, HOST, () => {
  console.log(`PKHeX PWA server running at http://${HOST}:${PORT}`);
  console.log(`Serving from: ${DIST_DIR}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}, closing HTTP server…`);
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced exit after shutdown timeout');
    process.exit(1);
  }, 14000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
