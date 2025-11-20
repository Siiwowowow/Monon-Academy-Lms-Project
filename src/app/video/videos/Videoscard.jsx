import React, { useState } from 'react'

export default function Videoscard({ videos }) {
  const [hoveredVideo, setHoveredVideo] = useState(null)
  const [playingVideo, setPlayingVideo] = useState(null)

  // YouTube ID extract function
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handlePlayVideo = (videoId, event) => {
    event.stopPropagation();
    setPlayingVideo(videoId);
  };

  const handleCloseVideo = (event) => {
    event.stopPropagation();
    setPlayingVideo(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">All Videos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => {
          const youtubeId = getYouTubeId(video.url);
          const thumbnailUrl = youtubeId 
            ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
            : video.thumbnail;

          return (
            <div 
              key={video._id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
              onMouseEnter={() => setHoveredVideo(video._id)}
              onMouseLeave={() => setHoveredVideo(null)}
            >
              {/* Video Thumbnail with Play Button */}
              <div className="relative">
                {playingVideo === video._id ? (
                  // YouTube Embedded Player
                  <div className="relative w-full h-48 ">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-t-xl"
                    ></iframe>
                    {/* Close Button */}
                    <button
                      onClick={handleCloseVideo}
                      className="absolute top-2 right-2  bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  // Thumbnail with Play Button
                  <div className="relative overflow-hidden cursor-pointer" onClick={(e) => handlePlayVideo(video._id, e)}>
                    {thumbnailUrl ? (
                      <>
                        <img 
                          src={thumbnailUrl} 
                          alt={video.title || 'Video thumbnail'}
                          className="w-full h-48 object-cover transition-transform duration-300"
                          style={{
                            transform: hoveredVideo === video._id ? 'scale(1.05)' : 'scale(1)'
                          }}
                        />
                        {/* Play Button Overlay */}
                        <div className={`absolute inset-0  bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
                          hoveredVideo === video._id ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform hover:scale-110 transition-all duration-300">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Fallback thumbnail if no image
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
                        <div className="text-white text-center">
                          <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          <span className="text-sm font-medium">Video Preview</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Video Content */}
              <div className="p-4">
                {/* Video Title */}
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 leading-tight">
                  {video.title || 'Untitled Video'}
                </h3>
                
                {/* Video Description */}
                {video.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                )}
                
                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {video.tags.length > 3 && (
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                        +{video.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Video Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    {video.views !== undefined && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        {video.views.toLocaleString()}
                      </span>
                    )}
                    
                    {video.uploadedAt && (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        {new Date(video.uploadedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  {/* Play Button */}
                  {!playingVideo && (
                    <button 
                      onClick={(e) => handlePlayVideo(video._id, e)}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded-full transition-colors duration-200 flex items-center cursor-pointer"
                    >
                      Play
                      <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {videos.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 9v4H6V9H4v6h16V9z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No videos available</h3>
          <p className="text-gray-400">Check back later for new content</p>
        </div>
      )}

      {/* Video Player Modal (Alternative) */}
     
    </div>
  )
}