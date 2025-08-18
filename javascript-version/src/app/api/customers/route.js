// Customer Management API - Full CRUD Operations
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Müşterileri listele (etkileşimlerle birlikte)
export async function GET() {
  try {
    console.log('📊 Fetching customers...')
    
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tags: true,
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 10  // Son 10 etkileşimi getir
        }
      }
    })
    
    console.log(`✅ Found ${customers.length} customers`)
    console.log('🔍 Sample customer interactions:', customers[0]?.interactions?.length || 0)
    
    return NextResponse.json(customers)
    
  } catch (error) {
    console.error('❌ Customers fetch error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Yeni müşteri ekle  
export async function POST(request) {
  try {
    const body = await request.json()
    console.log('📝 Creating customer:', body)

    // Validation
    if (!body.companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    // Create customer with proper enum values
    const customer = await prisma.customer.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        country: body.country || null,
        website: body.website || null,
        source: body.source || 'MANUAL', // MANUAL, GMAPS, IMPORT, WEBSITE
        status: body.status || 'ACTIVE', // ACTIVE, INACTIVE, PROSPECT, CUSTOMER
        notes: body.notes || null
      }
    })

    console.log('✅ Customer created:', customer.id)
    return NextResponse.json(customer)

  } catch (error) {
    console.error('❌ Customer creation error:', error)
    
    // Prisma unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu email adresi zaten kullanılıyor' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PUT - Müşteri güncelle
export async function PUT(request) {
  try {
    const body = await request.json()
    console.log('📝 Updating customer:', body.id)

    if (!body.id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.update({
      where: { id: body.id },
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        country: body.country,
        website: body.website,
        source: body.source,
        status: body.status,
        notes: body.notes
      }
    })

    console.log('✅ Customer updated:', customer.id)
    return NextResponse.json(customer)

  } catch (error) {
    console.error('❌ Customer update error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Müşteri sil
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    await prisma.customer.delete({
      where: { id }
    })

    console.log('✅ Customer deleted:', id)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Customer delete error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
