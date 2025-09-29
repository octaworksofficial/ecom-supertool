#!/bin/bash

# Railway Deployment Script
# This script handles Railway-specific deployment tasks

set -e  # Exit on any error

echo "🚀 Railway Deployment Started"
echo "📅 $(date)"
echo "🏗️  Environment: ${NODE_ENV:-production}"

# Clean up any problematic cache
echo "🧹 Cleaning cache..."
rm -rf node_modules/.cache || true
rm -rf .next/cache || true

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit --omit=dev

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