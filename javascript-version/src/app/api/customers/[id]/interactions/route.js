// Customer Interactions API - Notes, Calls, Meetings
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis
const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// GET - Müşteri etkileşimlerini listele
export async function GET(request, { params }) {
  try {
    const customerId = parseInt(params.id)
    
    if (!customerId || isNaN(customerId)) {
      return NextResponse.json(
        { error: 'Geçerli Customer ID gerekli' },
        { status: 400 }
      )
    }

    // ID ile doğrudan müşteriyi bul
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      )
    }

    const interactions = await prisma.customerInteraction.findMany({
      where: { customerId: customer.id },
      orderBy: { date: 'desc' }
    })

    // Frontend'e uygun format'ta response döndür
    const formattedInteractions = interactions.map(interaction => ({
      ...interaction,
      title: interaction.subject, // backend subject -> frontend title
      description: interaction.content // backend content -> frontend description
    }))

    return NextResponse.json(formattedInteractions)

  } catch (error) {
    console.error('Interactions API error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Yeni etkileşim ekle
export async function POST(request, { params }) {
  try {
    const customerId = parseInt(params.id)
    const data = await request.json()
    
    if (!customerId || isNaN(customerId)) {
      return NextResponse.json(
        { error: 'Geçerli Customer ID gerekli' },
        { status: 400 }
      )
    }

    // ID ile doğrudan müşteriyi bul
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Müşteri bulunamadı' },
        { status: 404 }
      )
    }

    // Gerekli alanları kontrol et - frontend title ve description gönderiyor
    if (!data.type || !data.title) {
      return NextResponse.json(
        { error: 'Tür ve başlık zorunludur' },
        { status: 400 }
      )
    }

    // Etkileşim oluştur - frontend field isimleri ile backend field isimleri eşleştir
    const interaction = await prisma.customerInteraction.create({
      data: {
        customerId: customer.id,
        type: data.type,
        subject: data.title, // frontend title -> backend subject
        content: data.description || null, // frontend description -> backend content  
        date: data.date ? new Date(data.date) : new Date()
      }
    })

    return NextResponse.json(interaction)

  } catch (error) {
    console.error('Interaction creation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
