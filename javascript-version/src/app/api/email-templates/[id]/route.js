import { NextResponse } from 'next/server'

import prisma from '@/libs/prisma'

// GET - Belirli bir email template'i getir
export async function GET(request, { params }) {
  try {
    const { id } = params
    
    const template = await prisma.emailTemplate.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Email template bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(template)
  } catch (error) {
    console.error('Email template getirme hatası:', error)
    
return NextResponse.json(
      { error: 'Email template getirilemedi' },
      { status: 500 }
    )
  }
}

// PUT - Email template'i güncelle
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const { name, subject, content, description, category, isHtml, isActive } = await request.json()

    const template = await prisma.emailTemplate.update({
      where: {
        id: parseInt(id)
      },
      data: {
        ...(name && { name }),
        ...(subject && { subject }),
        ...(content && { content }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(isHtml !== undefined && { isHtml }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Email template güncelleme hatası:', error)
    
return NextResponse.json(
      { error: 'Email template güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Email template'i sil
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    await prisma.emailTemplate.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({ message: 'Email template silindi' })
  } catch (error) {
    console.error('Email template silme hatası:', error)
    
return NextResponse.json(
      { error: 'Email template silinemedi' },
      { status: 500 }
    )
  }
}
