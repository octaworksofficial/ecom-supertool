#!/bin/bash

# Railway SQLite Auto Backup Script
# Bu script Railway'de otomatik backup almak için kullanılır

echo "🚀 Railway SQLite Auto Backup Started"
echo "📅 $(date)"

# Environment check
if [ "$NODE_ENV" = "production" ]; then
    echo "🏭 Production environment detected"
else
    echo "🧪 Development environment"
fi

# Database path check
if [ -f "./prisma/dev.db" ]; then
    echo "✅ SQLite database found at ./prisma/dev.db"
    DB_SIZE=$(du -h ./prisma/dev.db | cut -f1)
    echo "📏 Database size: $DB_SIZE"
elif [ -f "./dev.db" ]; then
    echo "✅ SQLite database found at ./dev.db"
    DB_SIZE=$(du -h ./dev.db | cut -f1)
    echo "📏 Database size: $DB_SIZE"
else
    echo "❌ SQLite database not found"
    echo "🔍 Checking locations..."
    find . -name "*.db" -type f -maxdepth 3 2>/dev/null || echo "No .db files found"
    echo "Expected paths:"
    echo "  - ./prisma/dev.db"
    echo "  - ./dev.db"
    exit 1
fi

# Run backup script
echo "🔄 Running backup script..."
node scripts/backup-db.js

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully"
    
    # Optional: Call API backup endpoint
    if [ "$ENABLE_API_BACKUP" = "true" ]; then
        echo "🌐 Triggering API backup..."
        curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/backup || echo "API backup skipped"
    fi
    
else
    echo "❌ Backup failed"
    exit 1
fi

echo "🏁 Railway SQLite Auto Backup Completed"
