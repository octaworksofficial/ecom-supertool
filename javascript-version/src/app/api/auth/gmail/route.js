import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    // Environment variables kontrolü
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI

    console.log('OAuth environment check:', {
      clientId: !!clientId,
      clientSecret: !!clientSecret,
      redirectUri: !!redirectUri,
      clientIdPrefix: clientId?.substring(0, 20),
      redirectUriValue: redirectUri
    })

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { 
          error: 'OAuth yapılandırması eksik',
          config: {
            clientId: !!clientId,
            clientSecret: !!clientSecret,
            redirectUri: !!redirectUri
          }
        },
        { status: 500 }
      )
    }

    // OAuth client oluştur
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    )

    // Kapsamları tanımla - daha spesifik
    const scopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
    
    // Authorization URL oluştur
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      include_granted_scopes: true,
      state: `ecom-supertool-${Date.now()}` // State parameter for security
    })
    
    console.log('Generated auth URL successfully:', authUrl)
    
    return NextResponse.json({ 
      success: true,
      authUrl,
      debug: {
        clientId: clientId.substring(0, 20) + '...',
        redirectUri: redirectUri,
        scopes: scopes,
        authUrlLength: authUrl.length
      }
    })
    
  } catch (error) {
    console.error('OAuth URL generation error:', {
      message: error.message,
      stack: error.stack
    })
    
    return NextResponse.json(
      { 
        error: 'OAuth URL oluşturulamadı',
        details: error.message
      },
      { status: 500 }
    )
  }
}