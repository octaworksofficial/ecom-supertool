import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingId = searchParams.get('id')
    const originalUrl = searchParams.get('url')
    
    if (!trackingId) {
      return NextResponse.redirect(originalUrl || 'https://ranblockgames.com')
    }
    
    console.log('🔗 Email link clicked:', {
      trackingId,
      originalUrl
    })
    
    // Email send kaydını bul ve click sayısını güncelle
    try {
      const emailSend = await prisma.emailSend.findFirst({
        where: { trackingId }
      })
      
      if (emailSend) {
        await prisma.emailSend.update({
          where: { id: emailSend.id },
          data: {
            clickCount: (emailSend.clickCount || 0) + 1,
            lastClickedAt: new Date()
          }
        })
        
        console.log('✅ Email click tracked:', {
          emailId: emailSend.id,
          campaignId: emailSend.campaignId,
          clickCount: (emailSend.clickCount || 0) + 1
        })
      }
    } catch (trackingError) {
      console.error('❌ Click tracking error:', trackingError)
    }
    
    // Original URL'e yönlendir
    return NextResponse.redirect(originalUrl || 'https://ranblockgames.com')
    
  } catch (error) {
    console.error('❌ Email tracking error:', error)
    
return NextResponse.redirect('https://ranblockgames.com')
  }
}
