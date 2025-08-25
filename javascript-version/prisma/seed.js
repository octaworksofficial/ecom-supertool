cd const { PrismaClient } = require('@prisma/client')

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

  // Test Customers (only a few for testing)
  const testCustomers = [
    {
      contactName: 'Test Müşteri 1',
      company: 'Test Şirketi A',
      email: 'test1@example.com',
      phone: '+90 555 111 1111',
      address: 'Test Adres 1, İstanbul',
      notes: 'Test müşterisi - backup testi için'
    },
    {
      contactName: 'Test Müşteri 2', 
      company: 'Test Şirketi B',
      email: 'test2@example.com',
      phone: '+90 555 222 2222',
      address: 'Test Adres 2, Ankara',
      notes: 'Test müşterisi - backup testi için'
    },
    {
      contactName: 'Test Müşteri 3',
      company: 'Test Şirketi C', 
      email: 'test3@example.com',
      phone: '+90 555 333 3333',
      address: 'Test Adres 3, İzmir',
      notes: 'Test müşterisi - backup testi için'
    }
  ]

  for (const customer of testCustomers) {
    await prisma.customer.upsert({
      where: { email: customer.email },
      update: {},
      create: customer
    })
  }

  console.log('✅ Customer database seeded successfully!')
  console.log(`📊 Added ${defaultTags.length} tags and ${testCustomers.length} test customers`)
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
