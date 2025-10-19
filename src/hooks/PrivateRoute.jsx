'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import useAuth from '../hooks/useAuth'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with "from" param to come back after login
      router.replace(`/login?from=${encodeURIComponent(pathname)}`)
    }
  }, [loading, user, router, pathname])

  if (loading || !user) {
    // Show loading or blank while checking auth or redirecting
    return <div className="loading loading-ring loading-xl"></div>
  }

  return children
}
