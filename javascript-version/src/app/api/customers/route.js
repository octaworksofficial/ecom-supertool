// Customer Management API - Full CRUD Operations
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📊 Fetching customers...')
    
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tags: true,
        interactions: {
          orderBy: { createdAt: 'desc' }
          // take: 10 kaldırıldı - tüm etkileşimleri getir
        }
      }
    })
    
    console.log(`✅ Found ${customers.length} customers`)
    return NextResponse.json(customers)
    
  } catch (error) {
    console.error('❌ Customers fetch error:', error)
    return NextResponse.json(
      { error: 'Müşteriler yüklenemedi', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('📝 Creating customer:', body)

    // Validation - sadece şirket ismi zorunlu
    if (!body.companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    // Email ve telefonu null olarak ayarla eğer boş string ise
    const email = body.email?.trim() || null
    const phone = body.phone?.trim() || null

    // Email dublicasyonu kontrolü - sadece email varsa
    if (email) {
      // ✅ mode: insensitive yerine manuel kontrol yap
      const emailLower = email.toLowerCase()
      
      // Tüm email'leri getir
      const existingCustomers = await prisma.customer.findMany({
        where: { 
          email: { not: null } 
        },
        select: { 
          id: true, 
          email: true 
        }
      })
      
      // Manuel olarak case-insensitive kontrol et
      const duplicateEmail = existingCustomers.find(customer => 
        customer.email && customer.email.toLowerCase() === emailLower
      )
      
      if (duplicateEmail) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 409 }
        )
      }
    }

    // Telefon dublicasyonu kontrolü - sadece telefon varsa
    if (phone) {
      const existingPhone = await prisma.customer.findFirst({
        where: { phone: phone }
      })
      
      if (existingPhone) {
        return NextResponse.json(
          { error: 'Bu telefon numarası zaten kullanılıyor' },
          { status: 409 }
        )
      }
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName?.trim() || null,
        email: email,
        phone: phone,
        address: body.address?.trim() || null,
        city: body.city?.trim() || null,
        country: body.country?.trim() || null,
        website: body.website?.trim() || null,
        source: body.source || 'MANUAL',
        status: body.status || 'ACTIVE'
      }
    })

    console.log('✅ Customer created:', customer.id)
    return NextResponse.json(customer)

  } catch (error) {
    console.error('❌ Customer creation error:', error)
    
    // Prisma unique constraint error - schema tarafında yakalanan hatalar
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('email')) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi zaten kullanılıyor' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Dublicasyonlu veri girişi tespit edildi' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

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

    // Önce mevcut müşteriyi bul
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: body.id }
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      )
    }

    // Email ve telefonu null olarak ayarla eğer boş string ise
    const email = body.email?.trim() || null
    const phone = body.phone?.trim() || null

    // Eğer email değişmediyse kontrol etme
    if (email && email !== existingCustomer.email) {
      // ✅ Case insensitive karşılaştırma için JavaScript kullan
      const emailLower = email.toLowerCase()
      
      // Tüm müşterileri al ve kendi ID'si dışındakileri kontrol et
      const allCustomers = await prisma.customer.findMany({
        where: {
          NOT: { id: body.id },
          email: { not: null }
        }
      })
      
      // Manuel case insensitive kontrol
      const duplicateEmail = allCustomers.find(cust => 
        cust.email && cust.email.toLowerCase() === emailLower
      )
      
      if (duplicateEmail) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi başka bir müşteri tarafından kullanılıyor' },
          { status: 409 }
        )
      }
    }

    // Eğer telefon değişmediyse kontrol etme
    if (phone && phone !== existingCustomer.phone) {
      const duplicatePhone = await prisma.customer.findFirst({
        where: { 
          phone: phone,
          NOT: {
            id: body.id
          }
        }
      })
      
      if (duplicatePhone) {
        return NextResponse.json(
          { error: 'Bu telefon numarası başka bir müşteri tarafından kullanılıyor' },
          { status: 409 }
        )
      }
    }

    const customer = await prisma.customer.update({
      where: { id: body.id },
      data: {
        companyName: body.companyName,
        contactName: body.contactName?.trim() || null,
        email: email,
        phone: phone,
        address: body.address?.trim() || null,
        city: body.city?.trim() || null,
        country: body.country?.trim() || null,
        website: body.website?.trim() || null,
        source: body.source,
        status: body.status
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
    
    // Unique constraint hatası (email/phone duplicate)
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('email')) {
        return NextResponse.json(
          { error: 'Bu e-posta adresi başka bir müşteri tarafından kullanılıyor' },
          { status: 409 }
        )
      }
      if (error.meta?.target?.includes('phone')) {
        return NextResponse.json(
          { error: 'Bu telefon numarası başka bir müşteri tarafından kullanılıyor' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'Dublicasyonlu veri girişi tespit edildi' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')
    const id = parseInt(idParam)

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçerli Customer ID gerekli' },
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
