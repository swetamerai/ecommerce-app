#!/bin/bash
# ─────────────────────────────────────────────────────────────
# E-Commerce App — Codespaces / Local startup script
# ─────────────────────────────────────────────────────────────

set -e

# 1. .env file check
if [ ! -f .env ]; then
  echo "📋 .env file nahi mili — .env.example se copy kar raha hoon..."
  cp .env.example .env
  echo "⚠️  .env file mein DATABASE_URL zaroor set karein, phir script dobara chalayein."
  exit 1
fi

# Load .env
export $(grep -v '^#' .env | xargs)

# 2. PostgreSQL start (Codespaces)
echo "🐘 PostgreSQL start kar raha hoon..."
sudo service postgresql start 2>/dev/null || true
sleep 2

# 3. Database banao (agar nahi hai)
echo "🗄️  Database check kar raha hoon..."
psql -U postgres -c "CREATE DATABASE ecommerce_db;" 2>/dev/null || true

# 4. DB schema push
echo "📦 Database schema push kar raha hoon..."
pnpm --filter @workspace/db run push

# 5. Sab servers chalao
echo ""
echo "🚀 Servers shuru ho rahe hain..."
echo "   API Server  → http://localhost:8080/api/healthz"
echo "   E-Commerce  → http://localhost:3000/shop/"
echo "   Portfolio   → http://localhost:3001/"
echo ""

# API server background mein
pnpm --filter @workspace/api-server run dev &
API_PID=$!

# Resume background mein
pnpm --filter @workspace/resume run dev &
RESUME_PID=$!

# E-Commerce foreground mein (CTRL+C se sab band ho jayenge)
trap "kill $API_PID $RESUME_PID 2>/dev/null; exit" INT TERM
pnpm --filter @workspace/ecommerce run dev
