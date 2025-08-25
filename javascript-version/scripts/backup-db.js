const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function createBackup() {
  try {
    console.log('Creating database backup...');
    
    // Get all customers
    const customers = await prisma.customer.findMany();
    const customerInteractions = await prisma.customerInteraction.findMany();
    const customerTags = await prisma.customerTag.findMany();
    const emailSends = await prisma.emailSend.findMany();
    const emailTemplates = await prisma.emailTemplate.findMany();
    const trendyolSettings = await prisma.trendyolSettings.findMany();
    const botActivities = await prisma.botActivity.findMany();
    const botStatus = await prisma.botStatus.findMany();
    
    const backup = {
      timestamp: new Date().toISOString(),
      customers,
      customerInteractions,
      customerTags,
      emailSends,
      emailTemplates,
      trendyolSettings,
      botActivities,
      botStatus
    };
    
    const filename = `railway_backup_${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.json`;
    
    // Log backup to console (Railway logs)
    console.log('=== DATABASE BACKUP START ===');
    console.log(JSON.stringify(backup, null, 2));
    console.log('=== DATABASE BACKUP END ===');
    
    console.log(`Backup created with ${customers.length} customers`);
    console.log('Backup logged to Railway deployment logs');
    
  } catch (error) {
    console.error('Backup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createBackup();
