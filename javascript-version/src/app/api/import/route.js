import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    // Check if user is authenticated (optional security)
    // const session = await getServerSession(authOptions)
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    console.log('Starting database import...')
    
    const body = await request.json()
    
    // Validate backup format
    if (!body.tables || !body.timestamp) {
      return NextResponse.json(
        { error: 'Invalid backup format. Missing tables or timestamp.' },
        { status: 400 }
      )
    }

    const { tables } = body
    let importStats = {
      customers: 0,
      customerInteractions: 0,
      customerTags: 0,
      emailSends: 0,
      emailTemplates: 0,
      trendyolSettings: 0,
      botActivities: 0,
      botStatus: 0,
      errors: []
    }

    // Clear existing data (optional - be careful!)
    const clearData = request.nextUrl.searchParams.get('clear') === 'true'
    
    if (clearData) {
      console.log('Clearing existing data...')
      await prisma.customerInteraction.deleteMany()
      await prisma.emailSend.deleteMany()
      await prisma.customer.deleteMany()
      await prisma.customerTag.deleteMany()
      await prisma.emailTemplate.deleteMany()
      await prisma.trendyolSettings.deleteMany()
      await prisma.botActivity.deleteMany()
      await prisma.botStatus.deleteMany()
      console.log('Existing data cleared')
    }

    // Import customers first (they are referenced by other tables)
    if (tables.customers && Array.isArray(tables.customers)) {
      for (const customer of tables.customers) {
        try {
          await prisma.customer.upsert({
            where: { id: customer.id },
            update: customer,
            create: customer
          })
          importStats.customers++
        } catch (error) {
          importStats.errors.push(`Customer ${customer.id}: ${error.message}`)
        }
      }
    }

    // Import customer tags
    if (tables.customerTags && Array.isArray(tables.customerTags)) {
      for (const tag of tables.customerTags) {
        try {
          await prisma.customerTag.upsert({
            where: { id: tag.id },
            update: tag,
            create: tag
          })
          importStats.customerTags++
        } catch (error) {
          importStats.errors.push(`CustomerTag ${tag.id}: ${error.message}`)
        }
      }
    }

    // Import customer interactions
    if (tables.customerInteractions && Array.isArray(tables.customerInteractions)) {
      for (const interaction of tables.customerInteractions) {
        try {
          await prisma.customerInteraction.upsert({
            where: { id: interaction.id },
            update: interaction,
            create: interaction
          })
          importStats.customerInteractions++
        } catch (error) {
          importStats.errors.push(`CustomerInteraction ${interaction.id}: ${error.message}`)
        }
      }
    }

    // Import email sends
    if (tables.emailSends && Array.isArray(tables.emailSends)) {
      for (const emailSend of tables.emailSends) {
        try {
          await prisma.emailSend.upsert({
            where: { id: emailSend.id },
            update: emailSend,
            create: emailSend
          })
          importStats.emailSends++
        } catch (error) {
          importStats.errors.push(`EmailSend ${emailSend.id}: ${error.message}`)
        }
      }
    }

    // Import email templates
    if (tables.emailTemplates && Array.isArray(tables.emailTemplates)) {
      for (const template of tables.emailTemplates) {
        try {
          await prisma.emailTemplate.upsert({
            where: { id: template.id },
            update: template,
            create: template
          })
          importStats.emailTemplates++
        } catch (error) {
          importStats.errors.push(`EmailTemplate ${template.id}: ${error.message}`)
        }
      }
    }

    // Import trendyol settings
    if (tables.trendyolSettings && Array.isArray(tables.trendyolSettings)) {
      for (const setting of tables.trendyolSettings) {
        try {
          await prisma.trendyolSettings.upsert({
            where: { id: setting.id },
            update: setting,
            create: setting
          })
          importStats.trendyolSettings++
        } catch (error) {
          importStats.errors.push(`TrendyolSettings ${setting.id}: ${error.message}`)
        }
      }
    }

    // Import bot activities
    if (tables.botActivities && Array.isArray(tables.botActivities)) {
      for (const activity of tables.botActivities) {
        try {
          await prisma.botActivity.upsert({
            where: { id: activity.id },
            update: activity,
            create: activity
          })
          importStats.botActivities++
        } catch (error) {
          importStats.errors.push(`BotActivity ${activity.id}: ${error.message}`)
        }
      }
    }

    // Import bot status
    if (tables.botStatus && Array.isArray(tables.botStatus)) {
      for (const status of tables.botStatus) {
        try {
          await prisma.botStatus.upsert({
            where: { id: status.id },
            update: status,
            create: status
          })
          importStats.botStatus++
        } catch (error) {
          importStats.errors.push(`BotStatus ${status.id}: ${error.message}`)
        }
      }
    }

    console.log('Import completed:', importStats)

    return NextResponse.json({
      success: true,
      message: 'Database import completed successfully',
      importStats,
      backupInfo: {
        timestamp: body.timestamp,
        version: body.version || 'unknown'
      }
    }, { status: 200 })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Import failed', 
        message: error.message 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET endpoint to show import instructions
export async function GET() {
  return NextResponse.json({
    message: 'Database Import API',
    usage: {
      method: 'POST',
      contentType: 'application/json',
      body: 'Backup JSON data from /api/backup',
      queryParams: {
        clear: 'Set to "true" to clear existing data before import (DANGEROUS!)'
      }
    },
    example: {
      curl: 'curl -X POST -H "Content-Type: application/json" -d @backup.json https://your-app.up.railway.app/api/import',
      clearData: 'curl -X POST -H "Content-Type: application/json" -d @backup.json "https://your-app.up.railway.app/api/import?clear=true"'
    }
  })
}
