import { NextResponse } from 'next/server'

import prisma from '@/libs/prisma'

// GET - Tüm email template'lerini getir
export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Email templates getirme hatası:', error)
    
return NextResponse.json(
      { error: 'Email templates getirilemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni email template oluştur
export async function POST(request) {
  try {
    const { name, subject, content, description, category, isHtml } = await request.json()

    // Detaylı validation
    const errors = []
    
    if (!name || !name.trim()) {
      errors.push('İsim')
    }
    
    if (!subject || !subject.trim()) {
      errors.push('Konu')
    }
    
    if (!content || !content.trim()) {
      errors.push('İçerik')
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: `Şu alanlar zorunludur: ${errors.join(', ')}` },
        { status: 400 }
      )
    }

    const template = await prisma.emailTemplate.create({
      data: {
        name: name.trim(),
        subject: subject.trim(),
        content: content.trim(),
        description: description?.trim() || null,
        category: category || 'General',
        isHtml: isHtml ?? true
      }
    })

    return NextResponse.json(template)
  } catch (error) {
    console.error('Email template oluşturma hatası:', error)
    
return NextResponse.json(
      { error: 'Email template oluşturulamadı: ' + error.message },
      { status: 500 }
    )
  }
}
