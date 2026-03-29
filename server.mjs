import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = join(__dirname, 'apps', 'web', 'dist');

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

app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  immutable: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
    if (filePath.endsWith('sw.js') || filePath.endsWith('workbox-*.js')) {
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

app.listen(PORT, HOST, () => {
  console.log(`PKHeX PWA server running at http://${HOST}:${PORT}`);
  console.log(`Serving from: ${DIST_DIR}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
});
