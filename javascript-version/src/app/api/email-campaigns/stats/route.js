import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeFilter = parseInt(searchParams.get('timeFilter')) || 30
    
    console.log('📊 Fetching email campaign statistics:', { timeFilter })
    
    // Tarih filtreleme
    const dateFilter = new Date()

    dateFilter.setDate(dateFilter.getDate() - timeFilter)

    // Temel veriler
    const allEmails = await prisma.emailSend.findMany({
      where: {
        sentAt: { gte: dateFilter }
      },
      orderBy: {
        sentAt: 'desc'
      }
    })
    
    // ID'e göre gruplama
    const campaigns = {}

    allEmails.forEach(email => {
      if (!campaigns[email.campaignId]) {
        campaigns[email.campaignId] = {
          name: email.subject,
          campaignId: email.campaignId,
          emails: [],
          totalEmails: 0,
          totalOpened: 0,
          totalClicks: 0,
          createdAt: email.sentAt
        }
      }

      campaigns[email.campaignId].emails.push(email)
      campaigns[email.campaignId].totalEmails++
      if (email.firstOpenedAt) campaigns[email.campaignId].totalOpened++
      campaigns[email.campaignId].totalClicks += email.clickCount || 0

      if (email.sentAt < campaigns[email.campaignId].createdAt) {
        campaigns[email.campaignId].createdAt = email.sentAt
      }
    })
    
    // Kampanya listesini hazırla
    const campaignList = Object.values(campaigns).map((campaign, index) => {
      const openRate = campaign.totalEmails > 0 ? 
        ((campaign.totalOpened / campaign.totalEmails) * 100).toFixed(1) : 0

      const clickRate = campaign.totalEmails > 0 ? 
        ((campaign.totalClicks / campaign.totalEmails) * 100).toFixed(1) : 0
      
      return {
        id: index + 1,
        name: campaign.name,
        campaignId: campaign.campaignId,
        createdAt: campaign.createdAt,
        totalEmails: campaign.totalEmails,
        totalOpened: campaign.totalOpened,
        totalClicks: campaign.totalClicks,
        openRate: parseFloat(openRate),
        clickRate: parseFloat(clickRate),
        status: campaign.totalEmails > 10 ? 'Büyük Kampanya' : 'Küçük Kampanya',
        duration: 'Anlık'
      }
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    // Ana istatistikler
    const totalCampaigns = campaignList.length
    const totalEmails = allEmails.length
    const totalOpened = allEmails.filter(e => e.firstOpenedAt).length
    const totalClicks = allEmails.reduce((sum, e) => sum + (e.clickCount || 0), 0)
    
    const openRate = totalEmails > 0 ? ((totalOpened / totalEmails) * 100).toFixed(1) : 0
    const clickRate = totalEmails > 0 ? ((totalClicks / totalEmails) * 100).toFixed(1) : 0
    const conversionRate = totalOpened > 0 ? ((totalClicks / totalOpened) * 100).toFixed(1) : 0

    // Grafik için günlük veriler (basit)
    const chartData = []

    for (let i = Math.min(timeFilter, 7) - 1; i >= 0; i--) {
      const date = new Date()

      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayEmails = allEmails.filter(e => 
        e.sentAt >= dayStart && e.sentAt <= dayEnd
      )
      
      chartData.push({
        date: dayStart.toISOString(),
        emails: dayEmails.length,
        opens: dayEmails.filter(e => e.firstOpenedAt).length,
        clicks: dayEmails.reduce((sum, e) => sum + (e.clickCount || 0), 0)
      })
    }

    console.log('✅ Email campaign statistics fetched:', {
      totalCampaigns,
      totalEmails,
      totalClicks
    })

    return NextResponse.json({
      totalCampaigns,
      totalEmails,
      totalClicks,
      campaignStats: {
        totalOpened,
        openRate: parseFloat(openRate),
        clickRate: parseFloat(clickRate),
        conversionRate: parseFloat(conversionRate),
        avgResponseTime: 'N/A'
      },
      chartData,
      campaigns: campaignList
    })

  } catch (error) {
    console.error('❌ Email campaign statistics error:', error)
    
return NextResponse.json(
      { error: 'İstatistikler yüklenemedi', details: error.message },
      { status: 500 }
    )
  }
}
