import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - List campaigns
export async function GET() {
  try {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { sends: true }
        }
      }
    })
    
    return NextResponse.json({ campaigns })
    
  } catch (error) {
    console.error('❌ Campaigns fetch error:', error)
    return NextResponse.json(
      { error: 'Kampanyalar yüklenemedi', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Create campaign
export async function POST(request) {
  try {
    const { name, subject, content, isHtml } = await request.json()
    
    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        subject,
        content,
        isHtml: isHtml || true
      }
    })
    
    console.log('✅ Campaign created:', campaign.id)
    
    return NextResponse.json({
      success: true,
      campaign,
      message: 'Kampanya başarıyla oluşturuldu'
    })
    
  } catch (error) {
    console.error('❌ Campaign creation error:', error)
    return NextResponse.json(
      { error: 'Kampanya oluşturulamadı', details: error.message },
      { status: 500 }
    )
  }
}