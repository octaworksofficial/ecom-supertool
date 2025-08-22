import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const campaignId = url.searchParams.get('campaignId')
    const days = parseInt(url.searchParams.get('days')) || 30
    
    console.log(`📊 Fetching real email analytics for ${days} days`)
    
    // Date filter
    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - days)
    
    // Base query conditions
    const whereCondition = {
      sentAt: { gte: dateFilter },
      ...(campaignId && { campaignId: parseInt(campaignId) })
    }
    
    // Get email sends with related data
    const sends = await prisma.emailSend.findMany({
      where: whereCondition,
      include: {
        customer: {
          select: {
            companyName: true,
            contactName: true
          }
        },
        campaign: {
          select: {
            name: true
          }
        }
      },
      orderBy: { sentAt: 'desc' },
      take: 1000
    })
    
    // Calculate summary stats
    const totalSent = sends.length
    const totalOpened = sends.filter(s => s.firstOpenedAt).length
    const totalClicked = sends.filter(s => s.clickCount > 0).length
    const totalOpenCount = sends.reduce((sum, s) => sum + (s.openCount || 0), 0)
    const totalClickCount = sends.reduce((sum, s) => sum + (s.clickCount || 0), 0)
    
    const openRate = totalSent > 0 ? (totalOpened / totalSent * 100) : 0
    const clickRate = totalSent > 0 ? (totalClicked / totalSent * 100) : 0
    const clickToOpenRate = totalOpened > 0 ? (totalClicked / totalOpened * 100) : 0
    
    // Daily stats - SQLite uyumlu
    const dailyStatsRaw = await prisma.$queryRaw`
      SELECT 
        date(sentAt) as date,
        COUNT(*) as sent,
        COUNT(firstOpenedAt) as opened,
        SUM(CASE WHEN clickCount > 0 THEN 1 ELSE 0 END) as clicked
      FROM email_sends 
      WHERE sentAt >= ${dateFilter.toISOString()}
      GROUP BY date(sentAt)
      ORDER BY date DESC
    `
    
    // Top domains - SQLite uyumlu
    const topDomainsRaw = await prisma.$queryRaw`
      SELECT 
        SUBSTR(emailAddress, INSTR(emailAddress, '@') + 1) as domain,
        COUNT(*) as count,
        COUNT(firstOpenedAt) as opened,
        SUM(CASE WHEN clickCount > 0 THEN 1 ELSE 0 END) as clicked
      FROM email_sends 
      WHERE sentAt >= ${dateFilter.toISOString()}
      GROUP BY domain
      ORDER BY count DESC
      LIMIT 10
    `
    
    // Format data for frontend
    const formattedSends = sends.map(send => ({
      id: send.id,
      email_address: send.emailAddress,
      subject: send.subject,
      company_name: send.customer?.companyName || null,
      contact_name: send.customer?.contactName || null,
      campaign_name: send.campaign?.name || null,
      sent_at: send.sentAt.toISOString(),
      first_opened_at: send.firstOpenedAt?.toISOString() || null,
      last_opened_at: send.lastOpenedAt?.toISOString() || null,
      open_count: send.openCount,
      click_count: send.clickCount,
      status: send.status
    }))
    
    console.log('✅ Real analytics fetched:', {
      totalSent,
      openRate: openRate.toFixed(2),
      clickRate: clickRate.toFixed(2)
    })
    
    return NextResponse.json({
      summary: {
        totalSent,
        totalOpened,
        totalClicked,
        totalOpenCount,
        totalClickCount,
        openRate: parseFloat(openRate.toFixed(2)),
        clickRate: parseFloat(clickRate.toFixed(2)),
        clickToOpenRate: parseFloat(clickToOpenRate.toFixed(2))
      },
      sends: formattedSends,
      dailyStats: dailyStatsRaw.map(stat => ({
        date: stat.date,
        sent: Number(stat.sent),
        opened: Number(stat.opened),
        clicked: Number(stat.clicked)
      })),
      topDomains: topDomainsRaw.map(domain => ({
        domain: domain.domain,
        count: Number(domain.count),
        opened: Number(domain.opened),
        clicked: Number(domain.clicked)
      }))
    })
    
  } catch (error) {
    console.error('❌ Real analytics error:', error)
    return NextResponse.json(
      { error: 'Analytics yüklenemedi', details: error.message },
      { status: 500 }
    )
  }
}