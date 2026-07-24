#!/bin/bash
# =============================================================================
# SUKABUMI EUNDEUR — VPS Deployment Script
# Run this on the VPS: bash /var/www/sukabumi-eundeur/deploy.sh
# =============================================================================

set -euo pipefail

PROJECT_DIR="/var/www/sukabumi-eundeur"
REPO_URL="https://github.com/dreflabs/sukabumieundeur.git"
COMPOSE_FILE="docker-compose.production.yml"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   SUKABUMI EUNDEUR — DEPLOY START        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# 1. Clone or pull latest code
if [ -d "$PROJECT_DIR/.git" ]; then
  echo "📦 Pulling latest code from GitHub..."
  cd "$PROJECT_DIR"
  git pull origin main
else
  echo "📦 Cloning repository..."
  rm -rf "$PROJECT_DIR"/*
  git clone "$REPO_URL" "$PROJECT_DIR"
  cd "$PROJECT_DIR"
fi

# 2. Verify .env.production exists
if [ ! -f "$PROJECT_DIR/.env.production" ]; then
  echo ""
  echo "❌ ERROR: .env.production tidak ditemukan!"
  echo "   Buat file .env.production di $PROJECT_DIR terlebih dahulu"
  exit 1
fi

echo "✅ .env.production ditemukan"

# 3. Build and start containers
echo ""
echo "🐳 Building Docker image..."
cd "$PROJECT_DIR"
docker compose -f "$COMPOSE_FILE" build --no-cache

echo ""
echo "🚀 Starting containers..."
docker compose -f "$COMPOSE_FILE" up -d

echo ""
echo "⏳ Menunggu containers sehat (60 detik)..."
sleep 60

echo ""
echo "📊 Status containers:"
docker compose -f "$COMPOSE_FILE" ps

echo ""
echo "📋 Logs app (20 baris terakhir):"
docker compose -f "$COMPOSE_FILE" logs app --tail=20

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   DEPLOY SELESAI! ✅                     ║"
echo "║   App berjalan di: http://127.0.0.1:3009 ║"
echo "╚══════════════════════════════════════════╝"
echo ""
