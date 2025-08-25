#!/bin/bash

# Railway Database Reset Script
echo "🚀 Starting Railway database migration..."

# Check if we're in production and FORCE_MIGRATE is set
if [ "$NODE_ENV" = "production" ] && [ "$FORCE_MIGRATE" = "true" ]; then
  echo "⚠️  FORCE_MIGRATE detected - Running database reset..."
  
  # Deploy migrations
  echo "📦 Deploying migrations..."
  npx prisma migrate deploy
  
  # Generate Prisma client
  echo "🔧 Generating Prisma client..."
  npx prisma generate
  
  echo "✅ Database migration completed!"
else
  echo "ℹ️  Normal startup - skipping migration"
  echo "   Set FORCE_MIGRATE=true in Railway to force migration"
fi
