'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'

export default function PrivateRoute({ children, requiredRole }) {
  const { user, dbUser, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!user && !dbUser) {
        router.replace(`/login?from=${encodeURIComponent(pathname)}`)
        return
      }

      // Check role-based access if required
      if (requiredRole) {
        const userRole = dbUser?.role || 'user'
        if (userRole !== requiredRole && !['admin'].includes(userRole)) {
          router.replace('/unauthorized')
          return
        }
      }

      setIsAuthorized(true)
    }
  }, [loading, user, dbUser, router, pathname, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-ring loading-lg"></div>
        <span className="ml-4">Checking authentication...</span>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-ring loading-lg"></div>
        <span className="ml-4">Redirecting...</span>
      </div>
    )
  }

  return children
}