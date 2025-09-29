import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma
  
  try {
    console.log('🏥 Health check started')
    
    prisma = new PrismaClient()
    await prisma.$connect()
    
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Test table access
    const customerCount = await prisma.customer.count().catch(() => 0)
    console.log(`📊 Customer count: ${customerCount}`)
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV,
      tables: {
        customers: customerCount
      }
    })
    
  } catch (error) {
    console.error('❌ Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      environment: process.env.NODE_ENV
    }, { status: 500 })
    
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}