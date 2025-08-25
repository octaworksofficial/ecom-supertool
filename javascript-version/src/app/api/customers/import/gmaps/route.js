// Google Maps to Customer Import API
import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ➕ POST - Google Maps verilerini müşteri olarak kaydet
export async function POST(request) {
  try {
    const body = await request.json()
    const { businesses } = body

    if (!businesses || !Array.isArray(businesses)) {
      return NextResponse.json(
        { success: false, error: 'İş yeri verileri gereklidir' },
        { status: 400 }
      )
    }

    const results = {
      success: 0,
      skipped: 0,
      errors: 0,
      details: [],
    }

    // 📊 Process each business
    for (const business of businesses) {
      try {
        // 🧹 Clean and prepare data
        const customerData = {
          name: business.name?.trim(),
          address: business.address?.trim() || null,
          phone: business.phone?.trim() || null,
          website: business.website?.trim() || null,
          businessType: business.types?.[0] || null,
          googlePlaceId: business.place_id?.trim(),
          googleRating: business.rating ? parseFloat(business.rating) : null,
          googleReviews: business.user_ratings_total ? parseInt(business.user_ratings_total) : null,
          latitude: business.geometry?.location?.lat ? parseFloat(business.geometry.location.lat) : null,
          longitude: business.geometry?.location?.lng ? parseFloat(business.geometry.location.lng) : null,
          status: 'POTENTIAL', // Default to potential customer
          priority: 'NORMAL',
        }

        // 📝 Validate required fields
        if (!customerData.name) {
          results.errors++
          results.details.push({
            name: business.name || 'Unknown',
            status: 'error',
            message: 'İş yeri adı eksik',
          })
          continue
        }

        // 🔍 Check if customer already exists
        const existingCustomer = await prisma.customer.findFirst({
          where: {
            OR: [
              { googlePlaceId: customerData.googlePlaceId },
              { name: customerData.name, address: customerData.address },
            ],
          },
        })

        if (existingCustomer) {
          results.skipped++
          results.details.push({
            name: customerData.name,
            status: 'skipped',
            message: 'Müşteri zaten mevcut',
            customerId: existingCustomer.id,
          })
          continue
        }

        // 💾 Create new customer
        const newCustomer = await prisma.customer.create({
          data: customerData,
        })

        // 🏷️ Add default tag for Google Maps imports
        const gmapsTag = await prisma.customerTag.upsert({
          where: { name: 'Google Maps' },
          update: {},
          create: { name: 'Google Maps', color: '#4285F4' },
        })

        await prisma.customer.update({
          where: { id: newCustomer.id },
          data: {
            tags: {
              connect: { id: gmapsTag.id },
            },
          },
        })

        results.success++
        results.details.push({
          name: customerData.name,
          status: 'success',
          message: 'Başarıyla eklendi',
          customerId: newCustomer.id,
        })
      } catch (error) {
        console.error(`❌ İş yeri işleme hatası (${business.name}):`, error)
        results.errors++
        results.details.push({
          name: business.name || 'Unknown',
          status: 'error',
          message: error.message || 'İşleme hatası',
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: results,
      message: `${results.success} müşteri eklendi, ${results.skipped} atlandı, ${results.errors} hata`,
    })
  } catch (error) {
    console.error('❌ Google Maps import hatası:', error)
    
return NextResponse.json(
      { success: false, error: 'İçe aktarma işlemi başarısız' },
      { status: 500 }
    )
  }
}
