'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Unauthorized() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You dont have permission to access this page.        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}