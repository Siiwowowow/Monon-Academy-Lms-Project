'use client'
import React, { useEffect } from "react"
import axios from "axios"
import useAuth from "./useAuth"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
})

const useAxiosSecure = () => {
  const { user } = useAuth()

  useEffect(() => {
    // Request interceptor to add Firebase token
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (user) {
          try {
            // Get fresh Firebase ID token
            const token = await user.getIdToken()
            config.headers.Authorization = `Bearer ${token}`
          } catch (error) {
            console.error('Error getting token:', error)
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle auth errors
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - redirect to login
          console.log("Authentication failed, redirecting to login")
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor)
      axiosInstance.interceptors.response.eject(responseInterceptor)
    }
  }, [user])

  return axiosInstance
}

export default useAxiosSecure