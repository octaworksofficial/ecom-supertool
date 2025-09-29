import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  let prisma
  
  try {
    console.log('🚀 Creating database backup...')
    console.log('📍 Environment:', process.env.NODE_ENV)
    console.log('🗄️ Database URL:', process.env.DATABASE_URL || 'Not set')
    
    prisma = new PrismaClient({
      log: ['error', 'warn']
    })
    
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    const [
      customers,
      customerInteractions, 
      customerTags,
      emailSends,
      emailTemplates,
      trendyolSettings,
      botActivities,
      botStatus
    ] = await Promise.all([
      prisma.customer.findMany(),
      prisma.customerInteraction.findMany(),
      prisma.customerTag.findMany(), 
      prisma.emailSend.findMany(),
      prisma.emailTemplate.findMany(),
      prisma.trendyolSettings.findMany(),
      prisma.botActivity.findMany(),
      prisma.botStatus.findMany()
    ])

    const backup = {
      timestamp: new Date().toISOString(),
      version: "1.0",
      tables: {
        customers,
        customerInteractions,
        customerTags, 
        emailSends,
        emailTemplates,
        trendyolSettings,
        botActivities,
        botStatus
      },
      stats: {
        customers: customers.length,
        customerInteractions: customerInteractions.length,
        customerTags: customerTags.length,
        emailSends: emailSends.length,
        emailTemplates: emailTemplates.length,
        trendyolSettings: trendyolSettings.length,
        botActivities: botActivities.length,
        botStatus: botStatus.length
      }
    }

    // Create filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
    const filename = `database-backup-${timestamp}.json`

    console.log(`Backup created: ${customers.length} customers, ${customerInteractions.length} interactions`)

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('❌ Backup error:', error)
    return NextResponse.json(
      { 
        error: 'Backup failed', 
        message: error.message,
        environment: process.env.NODE_ENV,
        databaseUrl: process.env.DATABASE_URL ? 'set' : 'not set'
      },
      { status: 500 }
    )
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}
