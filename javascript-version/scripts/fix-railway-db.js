#!/usr/bin/env node

// Railway Database URL Fixer
console.log('🔧 Fixing Railway DATABASE_URL...')

// Memory SQLite for Railway
const memoryUrl = 'file:memory:?cache=shared'
const tmpUrl = 'file:/tmp/railway.db'

console.log('📝 Set this in Railway Dashboard:')
console.log(`DATABASE_URL=${tmpUrl}`)
console.log('')
console.log('🚀 Then redeploy Railway service')
