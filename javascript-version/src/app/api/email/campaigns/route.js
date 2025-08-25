import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - List campaigns (from EmailSend data)
export async function GET() {
  try {
    // EmailSend verilerinden kampanyaları grupla
    const emailSends = await prisma.emailSend.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    // CampaignId'ye göre grupla
    const campaignMap = new Map()
    
    emailSends.forEach(email => {
      if (!campaignMap.has(email.campaignId)) {
        campaignMap.set(email.campaignId, {
          id: email.campaignId,
          name: `Kampanya ${email.campaignId}`,
          subject: email.subject,
          createdAt: email.createdAt,
          sends: [],
          sentCount: 0,
          openCount: 0,
          clickCount: 0
        })
      }
      
      const campaign = campaignMap.get(email.campaignId)

      campaign.sends.push(email)
      campaign.sentCount++
      if (email.firstOpenedAt) campaign.openCount++
      campaign.clickCount += email.clickCount || 0
      
      // En eski email'in tarihini kullan
      if (email.createdAt < campaign.createdAt) {
        campaign.createdAt = email.createdAt
      }
    })
    
    const campaigns = Array.from(campaignMap.values())
    
    return NextResponse.json({ campaigns })
    
  } catch (error) {
    console.error('❌ Campaigns fetch error:', error)
    
return NextResponse.json(
      { error: 'Kampanyalar yüklenemedi', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create campaign (not needed anymore, just return success)
export async function POST(request) {
  try {
    const { name, subject, content, isHtml } = await request.json()
    
    // 6 haneli rastgele campaign ID üret
    const campaignId = Math.floor(100000 + Math.random() * 900000).toString()
    
    console.log('✅ Campaign ID generated:', campaignId)
    
    return NextResponse.json({
      success: true,
      campaign: {
        id: campaignId,
        name,
        subject,
        content,
        isHtml: isHtml || true,
        createdAt: new Date()
      },
      message: 'Kampanya ID\'si oluşturuldu'
    })
    
  } catch (error) {
    console.error('❌ Campaign creation error:', error)
    
return NextResponse.json(
      { error: 'Kampanya oluşturulamadı', details: error.message },
      { status: 500 }
    )
  }
}