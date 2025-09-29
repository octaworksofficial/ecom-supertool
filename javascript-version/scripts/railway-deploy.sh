#!/bin/bash

# Railway Deployment Script - Cache Safe Version
# This script handles Railway-specific deployment tasks without conflicting with Docker cache mounts

set -e  # Exit on any error

echo "🚀 Railway Deployment Started (Cache Safe)"
echo "📅 $(date)"
echo "🏗️  Environment: ${NODE_ENV:-production}"

# Skip cache cleaning - let Railway handle it
echo "⚡ Skipping cache cleanup (Railway managed)"

# Set npm cache directory to avoid conflicts
export npm_config_cache=/tmp/npm-cache
mkdir -p /tmp/npm-cache

# Install dependencies with clean slate
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit --omit=dev --cache=/tmp/npm-cache

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Setup database
echo "🗄️ Setting up database..."
npx prisma db push --accept-data-loss

# Build application
echo "🏗️ Building application..."
npm run build

echo "✅ Railway deployment completed successfully!"