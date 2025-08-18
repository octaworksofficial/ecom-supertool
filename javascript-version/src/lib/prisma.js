// lib/prisma.js - Prisma Client Singleton
import { PrismaClient } from '@prisma/client'

// Global Prisma Client instance for development
const globalForPrisma = globalThis

// Create Prisma Client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
