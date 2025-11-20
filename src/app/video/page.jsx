'use client'
import React from 'react'
import Videoscard from './videos/Videoscard'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

export default function Video() {
  const instance = useAxiosSecure()

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await instance.get('/api/videos')
      console.log("Video API response:", response.data)
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading videos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">
          Error loading videos: {error.message}
        </div>
      </div>
    )
  }

  return <Videoscard videos={videos} />
}
