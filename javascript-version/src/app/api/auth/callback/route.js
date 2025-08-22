import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    
    console.log('OAuth callback - Code:', !!code, 'Error:', error)
    
    if (error) {
      console.error('OAuth error from Google:', error)
      const redirectUrl = `${process.env.NEXTAUTH_URL}/toplu-eposta?error=${encodeURIComponent(error)}`
      return NextResponse.redirect(redirectUrl)
    }
    
    if (!code) {
      console.error('No authorization code received')
      const redirectUrl = `${process.env.NEXTAUTH_URL}/toplu-eposta?error=no_authorization_code`
      return NextResponse.redirect(redirectUrl)
    }
    
    // Environment variables kontrolü
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
      console.error('Missing OAuth environment variables')
      const redirectUrl = `${process.env.NEXTAUTH_URL}/toplu-eposta?error=missing_oauth_config`
      return NextResponse.redirect(redirectUrl)
    }
    
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      )
      
      console.log('Attempting to exchange code for tokens...')
      
      // DOĞRU METHOD: getToken kullanın, getAccessToken değil
      const { tokens } = await oauth2Client.getToken(code)
      
      console.log('Tokens received successfully:', {
        access_token: !!tokens.access_token,
        refresh_token: !!tokens.refresh_token,
        expiry_date: tokens.expiry_date,
        token_type: tokens.token_type,
        scope: tokens.scope
      })
      
      // Token validation
      if (!tokens.access_token) {
        console.error('Access token is missing')
        const redirectUrl = `${process.env.NEXTAUTH_URL}/toplu-eposta?error=missing_access_token`
        return NextResponse.redirect(redirectUrl)
      }
      
      // Success redirect
      const redirectUrl = new URL(`${process.env.NEXTAUTH_URL}/toplu-eposta`)
      redirectUrl.searchParams.set('oauth_success', 'true')
      redirectUrl.searchParams.set('access_token', tokens.access_token)
      
      if (tokens.refresh_token) {
        redirectUrl.searchParams.set('refresh_token', tokens.refresh_token)
      }
      
      // Expiry date - eğer yoksa 1 saat sonra expire et
      const expiryDate = tokens.expiry_date || (Date.now() + 3600000)
      redirectUrl.searchParams.set('expiry_date', expiryDate.toString())
      
      console.log('Redirecting to success page with tokens')
      return NextResponse.redirect(redirectUrl.toString())
      
    } catch (tokenError) {
      console.error('Token exchange error details:', {
        message: tokenError.message,
        stack: tokenError.stack,
        code: tokenError.code,
        status: tokenError.status
      })
      
      let errorMessage = 'token_exchange_failed'
      let errorDetails = tokenError.message
      
      // Specific error handling
      if (tokenError.message?.includes('invalid_grant')) {
        errorMessage = 'invalid_authorization_code'
        errorDetails = 'Authorization code expired or invalid'
      } else if (tokenError.message?.includes('redirect_uri_mismatch')) {
        errorMessage = 'redirect_uri_mismatch'
        errorDetails = 'Redirect URI does not match Google Console settings'
      } else if (tokenError.code === 'ENOTFOUND') {
        errorMessage = 'network_error'
        errorDetails = 'Cannot connect to Google servers'
      }
      
      const redirectUrl = `${process.env.NEXTAUTH_URL}/toplu-eposta?error=${errorMessage}&details=${encodeURIComponent(errorDetails)}`
      return NextResponse.redirect(redirectUrl)
    }
    
  } catch (error) {
    console.error('OAuth callback general error:', {
      message: error.message,
      stack: error.stack
    })
    
    const redirectUrl = `${process.env.NEXTAUTH_URL}/toplu-eposta?error=callback_failed&details=${encodeURIComponent(error.message)}`
    return NextResponse.redirect(redirectUrl)
  }
}