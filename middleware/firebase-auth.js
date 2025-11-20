import { adminAuth } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export const firebaseAuth = (handler) => async (req) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization')
    let token = null
    
    if (authHeader) {
      const trimmedHeader = authHeader.trim()
      if (trimmedHeader.toLowerCase().startsWith('bearer ')) {
        token = trimmedHeader.substring(7) // Extract token after "Bearer "
      }
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    // Get user details from Firebase
    const user = await adminAuth.getUser(decodedToken.uid)

    // Add user info to request headers
    const headers = new Headers(req.headers)
    headers.set('x-user-id', user.uid)
    headers.set('x-user-email', user.email || '')
    headers.set('x-user-name', user.displayName || '')

    const modifiedReq = new Request(req, { headers })

    return handler(modifiedReq)

  } catch (error) {
    console.error('Firebase auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 401 }
    )
  }
}