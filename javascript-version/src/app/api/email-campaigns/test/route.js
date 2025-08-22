// Basit test API'si
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      totalCampaigns: 5,
      totalEmails: 24,
      totalClicks: 8,
      campaignStats: {
        totalOpened: 12,
        openRate: 50.0,
        clickRate: 33.3,
        conversionRate: 66.7,
        avgResponseTime: '2 saat'
      },
      chartData: [
        { date: '2025-08-19', emails: 19, opens: 8, clicks: 5 },
        { date: '2025-08-18', emails: 5, opens: 4, clicks: 3 }
      ],
      campaigns: [
        {
          id: 1,
          name: 'Yeni Ürünlerimiz - Özel Fırsat!',
          createdAt: new Date().toISOString(),
          totalEmails: 3,
          totalOpened: 2,
          totalClicks: 1,
          openRate: 66.7,
          clickRate: 33.3,
          status: 'Küçük Kampanya',
          duration: 'Anlık'
        },
        {
          id: 2,
          name: 'LINK TRACKING TEST',
          createdAt: new Date().toISOString(),
          totalEmails: 3,
          totalOpened: 1,
          totalClicks: 2,
          openRate: 33.3,
          clickRate: 66.7,
          status: 'Küçük Kampanya',
          duration: 'Anlık'
        }
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Test API hatası', details: error.message },
      { status: 500 }
    )
  }
}
