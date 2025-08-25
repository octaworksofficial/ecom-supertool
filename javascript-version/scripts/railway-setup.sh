#!/bin/bash

# Railway deployment setup script for SQLite

echo "🚀 Starting Railway deployment setup..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed the database (optional)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "🌱 Seeding database..."
    npm run seed
fi

echo "✅ Railway setup completed successfully!"
