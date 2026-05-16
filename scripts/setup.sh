#!/bin/bash
set -euo pipefail

echo "========================================"
echo "  Serene Stay — Project Setup"
echo "========================================"

# ---- Prerequisites ----
echo ""
echo "[1/6] Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install Node.js 20+."; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "❌ npm is required."; exit 1; }

echo "   Node.js $(node -v) | npm $(npm -v) | $(uname -m)"

# ---- .env file ----
echo ""
echo "[2/6] Environment file..."
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "   Created .env from .env.example"
    echo "   ⚠ Edit .env with your database credentials before continuing!"
    echo "   File: $(pwd)/.env"
    exit 0
  else
    echo "❌ No .env or .env.example found. Create a .env file with DATABASE_URL."
    exit 1
  fi
else
  echo "   .env file found ✓"
fi

# ---- Validate DATABASE_URL ----
if grep -q "DATABASE_URL" .env 2>/dev/null; then
  echo "   DATABASE_URL is set ✓"
else
  echo "❌ DATABASE_URL not found in .env"
  exit 1
fi

# ---- Install dependencies ----
echo ""
echo "[3/6] Installing dependencies..."
npm ci --omit=dev

# ---- Generate Prisma client ----
echo ""
echo "[4/6] Generating Prisma client..."
npx prisma generate

# ---- Apply migrations ----
echo ""
echo "[5/6] Applying database migrations..."
npx prisma migrate deploy

# ---- Build ----
echo ""
echo "[6/6] Building application..."
npm run build

echo ""
echo "========================================"
echo "  ✅ Setup complete!"
echo "========================================"
echo ""
echo "  Start the app:"
echo "    npm start              # Production mode on port 3000"
echo "    npm run dev            # Development mode"
echo ""
echo "  Seed demo data (optional):"
echo "    npm run prisma:seed"
echo ""
echo "  Login credentials:"
echo "    Admin: admin@serenestay.com / password123"
echo "    Guest: guest@example.com / password123"
echo ""
