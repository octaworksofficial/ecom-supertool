import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Basit bir test sorgusu
    const result = await prisma.$queryRaw`SELECT 1 as test`

    console.log('Database test result:', result)
    
    // Customer tablosunu kontrol et
    const customerCount = await prisma.customer.count()

    console.log('Customer count:', customerCount)
    
    return NextResponse.json({
      success: true,
      message: 'Database bağlantısı başarılı',
      customerCount
    })
  } catch (error) {
    console.error('Database test error:', error)
    
return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 })
  }
}