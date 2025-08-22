import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { 
      emails, // Array of {to, subject, content, customerId}
      campaignName, 
      isHtml, 
      tokens 
    } = await request.json()
    
    if (!tokens || !tokens.access_token) {
      return NextResponse.json(
        { error: 'Gmail yetkilendirmesi gerekli' },
        { status: 401 }
      )
    }
    
    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { error: 'Gönderilecek email listesi boş' },
        { status: 400 }
      )
    }
    
    console.log('📧 Starting bulk email send:', {
      emailCount: emails.length,
      campaignName: campaignName || 'Toplu Gönderim',
      isHtml
    })
    
    // 1. Önce kampanya oluştur
    const campaign = await prisma.emailCampaign.create({
      data: {
        name: campaignName || `Toplu Gönderim - ${new Date().toLocaleDateString('tr-TR')}`,
        subject: emails[0]?.subject || 'Toplu Email',
        description: `${emails.length} alıcıya gönderilen toplu email kampanyası`,
        status: 'sending',
        sentCount: 0
      }
    })
    
    console.log('✅ Campaign created with ID:', campaign.id)
    
    // 2. OAuth client yapılandır
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date
    })
    
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })
    
    // 3. Base URL for tracking
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}`
    
    const results = []
    let successCount = 0
    let errorCount = 0
    
    // 4. Her email'i gönder
    for (let i = 0; i < emails.length; i++) {
      const emailData = emails[i]
      const trackingId = crypto.randomUUID()
      
      try {
        // Link tracking ekle (HTML için)
        let finalContent = emailData.content
        if (isHtml) {
          finalContent = addTrackingToLinks(emailData.content, trackingId, baseUrl)
        }
        
        // Email oluştur
        const encodedSubject = encodeEmailHeader(emailData.subject)
        
        let emailLines
        if (isHtml) {
          emailLines = [
            `To: ${emailData.to}`,
            `Subject: ${encodedSubject}`,
            `From: noreply@ranblockgames.com`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=UTF-8`,
            '',
            finalContent
          ]
        } else {
          emailLines = [
            `To: ${emailData.to}`,
            `Subject: ${encodedSubject}`,
            `From: noreply@ranblockgames.com`,
            `MIME-Version: 1.0`,
            `Content-Type: text/plain; charset=UTF-8`,
            '',
            finalContent
          ]
        }
        
        const email = emailLines.join('\r\n')
        const encodedEmail = Buffer.from(email, 'utf8')
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '')
        
        // Gmail API ile gönder
        const result = await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: encodedEmail }
        })
        
        // Database'e kaydet - AYNI CAMPAIGN ID ile
        await prisma.emailSend.create({
          data: {
            campaignId: campaign.id, // 🎯 Aynı campaign ID
            customerId: emailData.customerId ? parseInt(emailData.customerId) : null,
            emailAddress: emailData.to,
            subject: emailData.subject,
            messageId: result.data.id,
            trackingId: trackingId,
            htmlContent: finalContent, // HTML content kaydet
            status: 'sent'
          }
        })
        
        // Customer interaction ekle
        if (emailData.customerId) {
          try {
            await prisma.customerInteraction.create({
              data: {
                customerId: parseInt(emailData.customerId),
                type: 'EMAIL',
                subject: 'Toplu Email Kampanyası',
                content: `Kampanya: ${campaign.name} - Konu: ${emailData.subject}`,
                date: new Date()
              }
            })
          } catch (interactionError) {
            console.error('❌ Customer interaction failed:', interactionError)
          }
        }
        
        results.push({
          to: emailData.to,
          success: true,
          messageId: result.data.id,
          trackingId: trackingId
        })
        
        successCount++
        console.log(`✅ Email ${i + 1}/${emails.length} sent to ${emailData.to}`)
        
      } catch (emailError) {
        console.error(`❌ Email ${i + 1} failed:`, emailError)
        results.push({
          to: emailData.to,
          success: false,
          error: emailError.message
        })
        errorCount++
      }
      
      // Rate limiting - 1 saniye bekle
      if (i < emails.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    // 5. Kampanya durumunu güncelle
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: {
        status: 'completed',
        sentCount: successCount,
        completedAt: new Date()
      }
    })
    
    console.log('🎯 Bulk email campaign completed:', {
      campaignId: campaign.id,
      totalEmails: emails.length,
      successCount,
      errorCount
    })
    
    return NextResponse.json({
      success: true,
      campaignId: campaign.id,
      campaignName: campaign.name,
      totalEmails: emails.length,
      successCount,
      errorCount,
      results
    })
    
  } catch (error) {
    console.error('❌ Bulk email send error:', error)
    return NextResponse.json(
      { error: 'Toplu email gönderilemedi', details: error.message },
      { status: 500 }
    )
  }
}

// Helper functions
function addTrackingToLinks(content, trackingId, baseUrl) {
  const trackingUrl = `${baseUrl}/api/email/track/click/${trackingId}`
  return content.replace(
    /<a\s+([^>]*href\s*=\s*["']([^"']+)["'][^>]*)>/gi,
    (match, attributes, originalUrl) => {
      const trackedUrl = `${trackingUrl}?url=${encodeURIComponent(originalUrl)}`
      return `<a ${attributes.replace(/href\s*=\s*["'][^"']+["']/i, `href="${trackedUrl}"`)}>` 
    }
  )
}

function encodeEmailHeader(text) {
  if (/[^\x00-\x7F]/.test(text)) {
    const encoded = Buffer.from(text, 'utf8').toString('base64')
    return `=?UTF-8?B?${encoded}?=`
  }
  return text
}