import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [
      customerCount,
      customerInteractionCount, 
      customerTagCount,
      emailSendCount,
      emailTemplateCount,
      trendyolSettingsCount,
      botActivityCount,
      botStatusCount
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.customerInteraction.count(),
      prisma.customerTag.count(), 
      prisma.emailSend.count(),
      prisma.emailTemplate.count(),
      prisma.trendyolSettings.count(),
      prisma.botActivity.count(),
      prisma.botStatus.count()
    ])

    return NextResponse.json({
      database: process.env.DATABASE_URL,
      counts: {
        customers: customerCount,
        customerInteractions: customerInteractionCount,
        customerTags: customerTagCount,
        emailSends: emailSendCount,
        emailTemplates: emailTemplateCount,
        trendyolSettings: trendyolSettingsCount,
        botActivities: botActivityCount,
        botStatus: botStatusCount
      }
    })

  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Stats failed', message: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
