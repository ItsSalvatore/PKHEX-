#!/usr/bin/env bash
set -euo pipefail

# ─── PKHeX PWA — Linux Deployment Script ───
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh              # full install + build + start
#   ./deploy.sh --pull       # git pull --ff-only, then full deploy (updates from remote)
#   ./deploy.sh --restart    # restart existing PM2 process
#   ./deploy.sh --stop       # stop PM2 process
#   ./deploy.sh --logs       # tail PM2 logs

APP_NAME="pkhex-pwa"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[PKHeX]${NC} $1"; }
warn() { echo -e "${YELLOW}[PKHeX]${NC} $1"; }
err()  { echo -e "${RED}[PKHeX]${NC} $1" >&2; }

# ─── Optional: sync from git before full deploy ───
if [[ "${1:-}" == "--pull" ]]; then
  shift
  log "Pulling latest from git (ff-only)..."
  if ! git rev-parse --git-dir &>/dev/null; then
    err "Not a git repository. On the server, clone first, e.g.:"
    err "  git clone <your-remote-url> && cd <repo-dir>"
    exit 1
  fi
  git pull --ff-only
fi

# ─── Handle flags ───
if [[ "${1:-}" == "--restart" ]]; then
  log "Restarting $APP_NAME..."
  pm2 restart "$APP_NAME"
  pm2 status
  exit 0
fi

if [[ "${1:-}" == "--stop" ]]; then
  log "Stopping $APP_NAME..."
  pm2 stop "$APP_NAME"
  pm2 status
  exit 0
fi

if [[ "${1:-}" == "--logs" ]]; then
  pm2 logs "$APP_NAME" --lines 100
  exit 0
fi

# ─── Preflight checks ───
log "Checking prerequisites..."

if ! command -v node &>/dev/null; then
  err "Node.js is not installed. Install Node.js 18+ first."
  err "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
  err "  sudo apt-get install -y nodejs"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if (( NODE_VERSION < 18 )); then
  err "Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

log "Node.js $(node -v) ✓"

if ! command -v npm &>/dev/null; then
  err "npm is not installed."
  exit 1
fi
log "npm $(npm -v) ✓"

# ─── Install PM2 globally if missing ───
if ! command -v pm2 &>/dev/null; then
  warn "PM2 not found. Installing globally..."
  npm install -g pm2
fi
log "PM2 $(pm2 -v) ✓"

# ─── Create logs directory ───
mkdir -p logs

# ─── Install dependencies ───
log "Installing dependencies..."
npm install

# ─── Build the project ───
log "Building core package..."
npm run build:core

log "Building web app (PWA)..."
npm run build:web

# Verify build output exists
if [ ! -d "apps/web/dist" ]; then
  err "Build failed — apps/web/dist not found."
  exit 1
fi

BUILD_SIZE=$(du -sh apps/web/dist | cut -f1)
log "Build complete. Output: apps/web/dist ($BUILD_SIZE)"

# ─── Stop existing PM2 process if running ───
if pm2 describe "$APP_NAME" &>/dev/null; then
  warn "Stopping existing $APP_NAME process..."
  pm2 delete "$APP_NAME" || true
fi

# ─── Start with PM2 ───
log "Starting $APP_NAME with PM2..."
pm2 start ecosystem.config.cjs

# ─── Save PM2 process list ───
pm2 save

# ─── Setup PM2 startup (run once — requires sudo) ───
echo ""
log "To auto-start on boot, run:"
echo -e "  ${CYAN}pm2 startup${NC}"
echo -e "  Then copy-paste the command it outputs (requires sudo)."
echo ""

# ─── Show status ───
pm2 status

echo ""
log "═══════════════════════════════════════════════"
log "  PKHeX PWA is live!"
log "  URL:  http://$(hostname -I | awk '{print $1}'):${PORT:-11100}"
log "  "
log "  Commands:"
log "    ./deploy.sh --restart   Restart the server"
log "    ./deploy.sh --stop      Stop the server"
log "    ./deploy.sh --logs      View live logs"
log "    pm2 monit               Real-time monitoring"
log "═══════════════════════════════════════════════"
