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
    const customerId = params.id
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID gerekli' },
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

    return NextResponse.json(interactions)

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
    const customerId = params.id
    const data = await request.json()
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID gerekli' },
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

    // Gerekli alanları kontrol et
    if (!data.type || !data.title) {
      return NextResponse.json(
        { error: 'Tür ve başlık zorunludur' },
        { status: 400 }
      )
    }

    // Etkileşim oluştur
    const interaction = await prisma.customerInteraction.create({
      data: {
        customerId: customer.id,
        type: data.type,
        title: data.title,
        description: data.description || null,
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
