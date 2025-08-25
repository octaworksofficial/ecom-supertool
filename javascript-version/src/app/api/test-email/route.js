import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

export async function GET(request) {
  console.log('🧪 TEST API called!')
  
  try {
    // Skip database connection during build
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        message: 'Database not configured',
        test: 'skipped during build'
      })
    }

    const prisma = new PrismaClient()
    
    // Test email oluştur
    const testEmail = await prisma.emailSend.create({
      data: {
        campaignId: '123456',
        toEmail: 'test@example.com',
        subject: 'Test Email',
        content: 'Bu bir test emailidir',
        isHtml: false,
        status: 'sent',
        sentAt: new Date(),
        trackingId: `test-${Date.now()}`
      }
    })
    
    console.log('✅ Test email created:', testEmail)
    
    // Tüm emailları say
    const emailCount = await prisma.emailSend.count()

    console.log('📊 Total emails in DB:', emailCount)
    
    return NextResponse.json({
      success: true,
      testEmail,
      totalCount: emailCount
    })
    
  } catch (error) {
    console.error('❌ Test error:', error)
    
return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
