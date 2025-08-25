const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding customer database...')

  // Default Customer Tags
  const defaultTags = [
    { name: 'VIP Müşteri', color: '#10B981' },
    { name: 'Potansiyel', color: '#F59E0B' },
    { name: 'Aktif', color: '#3B82F6' },
    { name: 'Pasif', color: '#6B7280' },
    { name: 'Önemli', color: '#EF4444' },
    { name: 'Yeni', color: '#8B5CF6' },
    { name: 'B2B', color: '#059669' },
    { name: 'B2C', color: '#DC2626' }
  ]

  for (const tag of defaultTags) {
    await prisma.customerTag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag
    })
  }

  console.log('✅ Customer database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
