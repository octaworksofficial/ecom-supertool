// Single Customer API - GET, PUT, DELETE Operations
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 📄 GET - Tek müşteri detayını getir
export async function GET(request, { params }) {
  try {
    const { id } = params

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        tags: true,
        interactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Müşteri bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('❌ Müşteri detay hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Müşteri detayı alınamadı' },
      { status: 500 }
    )
  }
}

// ✏️ PUT - Müşteri bilgilerini güncelle
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

    // Email validasyonu - boş string'i null olarak ayarla
    const updateData = {
      ...body,
      email: body.email?.trim() || null
    }

    // Unique email kontrolü
    if (updateData.email) {
      const existingCustomer = await prisma.customer.findFirst({
        where: { 
          email: updateData.email,
          NOT: { id: body.id }
        }
      })
      
      if (existingCustomer) {
        return NextResponse.json(
          { error: 'Bu email adresi başka bir müşteri tarafından kullanılıyor' },
          { status: 409 }
        )
      }
    }

    const customer = await prisma.customer.update({
      where: { id: body.id },
      data: {
        companyName: updateData.companyName,
        contactName: updateData.contactName,
        email: updateData.email,
        phone: updateData.phone,
        address: updateData.address,
        city: updateData.city,
        country: updateData.country,
        website: updateData.website,
        source: updateData.source,
        status: updateData.status
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
    
    // Unique constraint hatası (email duplicate)
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { error: 'Bu email adresi başka bir müşteri tarafından kullanılıyor' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// 🗑️ DELETE - Müşteriyi sil
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    })

    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Müşteri bulunamadı' },
        { status: 404 }
      )
    }

    // 🗑️ Delete customer (cascade will handle relations)
    await prisma.customer.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Müşteri başarıyla silindi',
    })
  } catch (error) {
    console.error('❌ Müşteri silme hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Müşteri silinemedi' },
      { status: 500 }
    )
  }
}
