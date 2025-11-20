import admin from 'firebase-admin'

if (!admin.apps.length) {
  try {
    // Validate required environment variables
    const requiredEnvVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    }

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`)
    }

    // Convert literal \n sequences to actual newlines in private key
    const privateKey = requiredEnvVars.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: requiredEnvVars.FIREBASE_PROJECT_ID,
        clientEmail: requiredEnvVars.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    })
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error.message)
    throw error
  }
}

export const adminAuth = admin.auth()