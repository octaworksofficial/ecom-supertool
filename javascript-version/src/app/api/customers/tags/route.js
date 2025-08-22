// Customer Tags API - Tag Management
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// 📋 GET - Tüm etiketleri listele
export async function GET() {
  try {
    const tags = await prisma.customerTag.findMany({
      include: {
        _count: {
          select: { customers: true }
        }
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      success: true,
      data: tags,
    })
  } catch (error) {
    console.error('❌ Etiket listesi hatası:', error)
    return NextResponse.json(
      { success: false, error: 'Etiket listesi alınamadı' },
      { status: 500 }
    )
  }
}

// ➕ POST - Yeni etiket oluştur
export async function POST(request) {
  try {
    const body = await request.json()
    
    const tagData = {
      name: body.name?.trim(),
      color: body.color || '#2196F3',
    }

    // 📝 Required field validation
    if (!tagData.name) {
      return NextResponse.json(
        { success: false, error: 'Etiket adı gereklidir' },
        { status: 400 }
      )
    }

    // 💾 Create tag
    const tag = await prisma.customerTag.create({
      data: tagData,
    })

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Etiket başarıyla oluşturuldu',
    })
  } catch (error) {
    console.error('❌ Etiket oluşturma hatası:', error)
    
    // Handle unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Bu etiket adı zaten kullanımda' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Etiket oluşturulamadı' },
      { status: 500 }
    )
  }
}
