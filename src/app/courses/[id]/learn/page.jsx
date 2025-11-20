"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { IoPauseCircleOutline, IoPlayCircleOutline, IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { MdFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { RiForward10Line, RiReplay10Line } from "react-icons/ri";
import { ChevronDown, ChevronUp, Loader2, PlayCircle } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";

// Video Player Component
const VideoPlayer = ({ videoUrl, isPlaying, onPlayPause, onTimeUpdate, onDurationChange }) => {
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const playerRef = useRef(null);
  const apiScriptLoaded = useRef(false);

  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [showResolutionMenu, setShowResolutionMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [showCenterPlay, setShowCenterPlay] = useState(false);

  const playbackRates = [2.0, 1.75, 1.5, 1.25, 1.0, 0.75, 0.5];
  const availableQualities = ['hd1080', 'hd720', 'large', 'medium', 'small', 'auto'];

  // Get video ID from URL
  const getVideoId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&?\n]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(videoUrl);

  // Check for mobile and handle fullscreen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      resetHideTimeout();
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!playerReady) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          onPlayPause();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          handleSeek(-10);
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          handleSeek(10);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(Math.min(volume + 10, 100));
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(Math.max(volume - 10, 0));
          break;
        case '>':
        case '.':
          e.preventDefault();
          const nextRate = playbackRates.find(rate => rate > playbackRate) || playbackRates[0];
          handleRateChange(nextRate);
          break;
        case '<':
        case ',':
          e.preventDefault();
          const prevRate = [...playbackRates].reverse().find(rate => rate < playbackRate) || playbackRates[playbackRates.length - 1];
          handleRateChange(prevRate);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [playerReady, volume, playbackRate, showControls, currentTime, duration, onPlayPause]);

  // Auto-hide controls logic
  const resetHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    setShowControls(true);
    setShowCenterPlay(false);
    
    if (isPlaying && !showSpeedMenu && !showResolutionMenu && !showVolumeSlider) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowCenterPlay(true);
      }, 2000);
    }
  }, [isPlaying, showSpeedMenu, showResolutionMenu, showVolumeSlider]);

  // Format time to MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // YouTube Player Event Handlers
  const onPlayerReady = useCallback((event) => {
    console.log("YouTube Player Ready");
    playerRef.current = event.target;
    setPlayerReady(true);
    setIsLoading(false);
    setError(null);
    
    try {
      const playerDuration = event.target.getDuration();
      setDuration(playerDuration);
      onDurationChange(playerDuration);
      event.target.setVolume(volume);
    } catch (error) {
      console.log('Error in onPlayerReady:', error);
    }
  }, [volume, onDurationChange]);

  const onPlayerStateChange = useCallback((event) => {
    if (!window.YT) return;

    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        resetHideTimeout();
        break;
      case window.YT.PlayerState.PAUSED:
        setShowControls(true);
        setShowCenterPlay(true);
        break;
      case window.YT.PlayerState.ENDED:
        setShowControls(true);
        setShowCenterPlay(true);
        break;
      case window.YT.PlayerState.BUFFERING:
        setIsLoading(true);
        break;
      case window.YT.PlayerState.CUED:
        setIsLoading(false);
        break;
      default:
        setIsLoading(false);
        break;
    }
  }, [resetHideTimeout]);

  const onPlayerError = useCallback((event) => {
    console.error('YouTube Player Error:', event.data);
    setIsLoading(false);
    const errorMsg = getErrorMessage(event.data);
    setError(`Video Error: ${errorMsg}`);
  }, []);

  const getErrorMessage = (errorCode) => {
    const errors = {
      2: 'Invalid video ID',
      5: 'HTML5 player error',
      100: 'Video not found',
      101: 'Embedding not allowed',
      150: 'Embedding not allowed'
    };
    return errors[errorCode] || 'Unknown error occurred';
  };

  // Update current time periodically when playing
  useEffect(() => {
    let interval;
    if (playerReady && playerRef.current) {
      interval = setInterval(() => {
        try {
          if (playerRef.current && playerRef.current.getCurrentTime) {
            const time = playerRef.current.getCurrentTime();
            setCurrentTime(time);
            onTimeUpdate(time);
          }
        } catch (error) {
          console.log('Error getting current time:', error);
        }
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playerReady, onTimeUpdate]);

  // Load YouTube IFrame API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }

      if (!apiScriptLoaded.current) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        
        script.onload = () => {
          console.log("YouTube API script loaded");
        };
        
        script.onerror = () => {
          console.error("Failed to load YouTube API");
          setError("Failed to load YouTube player. Check your internet connection.");
          setIsLoading(false);
        };

        document.head.appendChild(script);
        apiScriptLoaded.current = true;
      }

      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API Ready");
        createPlayer();
      };
    };

    if (videoId) {
      loadYouTubeAPI();
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Create YouTube Player
  const createPlayer = useCallback(() => {
    if (!videoId) {
      setError("Invalid YouTube URL");
      setIsLoading(false);
      return;
    }

    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    if (!window.YT || !window.YT.Player) {
      setTimeout(createPlayer, 500);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'disablekb': 1,
          'modestbranding': 1,
          'rel': 0,
          'enablejsapi': 1,
          'origin': window.location.origin
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
      
    } catch (error) {
      console.error('Failed to create YouTube player:', error);
      setError('Failed to create video player');
      setIsLoading(false);
    }
  }, [videoId, onPlayerReady, onPlayerStateChange, onPlayerError]);

  // Control player based on isPlaying prop
  useEffect(() => {
    if (playerRef.current && playerReady) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, playerReady]);

  // Fixed seek function
  const handleSeek = useCallback((seconds) => {
    if (playerRef.current && duration > 0) {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    }
    resetHideTimeout();
  }, [currentTime, duration, resetHideTimeout]);

  // Player control functions
  const togglePlay = useCallback(() => {
    onPlayPause();
    resetHideTimeout();
  }, [onPlayPause, resetHideTimeout]);

  const skipForward = useCallback(() => {
    handleSeek(10);
  }, [handleSeek]);

  const skipBackward = useCallback(() => {
    handleSeek(-10);
  }, [handleSeek]);

  const handleProgressClick = useCallback((e) => {
    if (playerRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * duration;
      
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
      resetHideTimeout();
    }
  }, [duration, resetHideTimeout]);

  const handleRateChange = useCallback((rate) => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
    }
    resetHideTimeout();
  }, [resetHideTimeout]);

  const handleQualityChange = useCallback((newQuality) => {
    if (playerRef.current) {
      playerRef.current.setPlaybackQuality(newQuality);
      setQuality(newQuality);
      setShowResolutionMenu(false);
    }
    resetHideTimeout();
  }, [resetHideTimeout]);

  const handleVolumeChange = useCallback((newVolume) => {
    const volumeValue = Math.max(0, Math.min(100, newVolume));
    if (playerRef.current) {
      playerRef.current.setVolume(volumeValue);
    }
    setVolume(volumeValue);
    resetHideTimeout();
  }, [resetHideTimeout]);

  const toggleMute = useCallback(() => {
    handleVolumeChange(volume > 0 ? 0 : 80);
  }, [volume, handleVolumeChange]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log(`Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    resetHideTimeout();
  }, [resetHideTimeout]);

  // Get volume icon
  const getVolumeIcon = () => {
    if (volume === 0) return <IoVolumeMuteOutline />;
    if (volume < 30) return <IoVolumeHighOutline />;
    return <IoVolumeHighOutline />;
  };

  // Get quality display name
  const getQualityDisplayName = (q) => {
    const qualityMap = {
      'hd1080': '1080p',
      'hd720': '720p',
      'large': '480p',
      'medium': '360p',
      'small': '240p',
      'auto': 'Auto'
    };
    return qualityMap[q] || q;
  };

  // Handle interactions
  const handleContainerInteraction = () => {
    resetHideTimeout();
  };

  const handleMouseLeave = () => {
    if (isPlaying && !isMobile) {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowCenterPlay(true);
      }, 1000);
    }
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!videoId) {
    return (
      <div className="w-full bg-black rounded-2xl flex items-center justify-center h-96">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-2">❌ No video available</div>
          <p className="opacity-90">Please select a lesson</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full bg-black shadow-2xl transition-all duration-300 select-none relative group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'rounded-2xl'
      }`}
      onMouseEnter={handleContainerInteraction}
      onMouseMove={handleContainerInteraction}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlay}
    >
      {/* Video Player */}
      <div className={`relative bg-black ${isFullscreen ? 'h-screen' : 'h-80 sm:h-96 md:h-[450px] lg:h-[500px]'}`}>
        
        {/* YouTube Player Container */}
        <div id="youtube-player" className="w-full h-full rounded-2xl overflow-hidden">
          {isLoading && !error && (
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white text-lg font-medium">Loading video...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-red-800/95 flex items-center justify-center p-6 rounded-2xl">
            <div className="text-center text-white">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold mb-2">Playback Error</h3>
              <p className="text-lg mb-6 opacity-90">{error}</p>
              <button 
                onClick={createPlayer}
                className="px-6 py-3 bg-white text-red-700 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Center Play Button */}
        {showCenterPlay && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="text-white text-6xl sm:text-8xl opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-200"
            >
              <IoPlayCircleOutline />
            </button>
          </div>
        )}

        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Top Controls Bar */}
          <div className="absolute top-0 left-0 right-0 p-4">
            {/* Video Title */}
            <div className="text-white text-sm font-semibold truncate">
              {videoUrl ? "Now Playing" : "Select a lesson"}
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            
            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
              <div 
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative group/progress"
                onClick={handleProgressClick}
              >
                <div 
                  className="absolute h-2 bg-white/30 rounded-full transition-all duration-200"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                <div 
                  className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-200"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity duration-200"
                  style={{ left: `${progressPercentage}%`, marginLeft: '-8px' }}
                ></div>
              </div>
              
              {/* Time Display */}
              <div className="flex justify-between text-white text-sm mt-2">
                <span className="font-mono">{formatTime(currentTime)}</span>
                <span className="font-mono">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons Row */}
            <div className="flex items-center justify-between">
              
              {/* Left Controls */}
              <div className="flex items-center space-x-4 sm:space-x-6">
                
                {/* Play/Pause */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="text-white text-2xl sm:text-3xl hover:text-blue-300 transition-all duration-200 hover:scale-110"
                >
                  {isPlaying ? <IoPauseCircleOutline /> : <IoPlayCircleOutline />}
                </button>

                {/* Skip Backward */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipBackward();
                  }}
                  className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-all duration-200 hover:scale-110"
                >
                  <RiReplay10Line />
                </button>

                {/* Skip Forward */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    skipForward();
                  }}
                  className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-all duration-200 hover:scale-110"
                >
                  <RiForward10Line />
                </button>

                {/* Volume Control */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-all duration-200 hover:scale-110"
                  >
                    {getVolumeIcon()}
                  </button>

                  {/* Volume Slider */}
                  <div className="w-24 hidden sm:block">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-4 sm:space-x-6">
                
                {/* Playback Speed */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSpeedMenu(!showSpeedMenu);
                      setShowResolutionMenu(false);
                    }}
                    className="text-white text-sm sm:text-base font-semibold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                  >
                    {playbackRate}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden z-10">
                      {playbackRates.map((rate) => (
                        <button
                          key={rate}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRateChange(rate);
                          }}
                          className={`block w-full py-3 px-4 text-left text-sm transition-all duration-200 ${
                            rate === playbackRate 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {rate}x {rate === 1.0 && 'Normal'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quality Settings */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowResolutionMenu(!showResolutionMenu);
                      setShowSpeedMenu(false);
                    }}
                    className="text-white text-sm sm:text-base font-semibold px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
                  >
                    {getQualityDisplayName(quality)}
                  </button>

                  {showResolutionMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden z-10">
                      {availableQualities.map((q) => (
                        <button
                          key={q}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQualityChange(q);
                          }}
                          className={`block w-full py-3 px-4 text-left text-sm transition-all duration-200 ${
                            q === quality 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold' 
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          {getQualityDisplayName(q)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                  className="text-white text-xl sm:text-2xl hover:text-blue-300 transition-all duration-200 hover:scale-110"
                >
                  {isFullscreen ? <MdOutlineFullscreenExit /> : <MdFullscreen />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Learn Component
export default function LearnPage({ params }) {
  const { id } = params;
  const axiosSecure = useAxiosSecure();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosSecure.get(`/api/courses/${id}`);
        setCourse(res.data);
        // Set the first lesson as default
        const firstLesson = res.data?.curriculum?.[0]?.lessons?.[0] || null;
        setCurrentLesson(firstLesson);
        // Expand first chapter by default
        if (res.data?.curriculum?.length > 0) {
          setExpandedChapters([0]);
        }
      } catch (err) {
        console.error("❌ Error loading course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, axiosSecure]);

  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle time update
  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  // Handle duration change
  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  // Toggle chapter accordion
  const toggleChapter = (chapterIndex) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterIndex)
        ? prev.filter((i) => i !== chapterIndex)
        : [...prev, chapterIndex]
    );
  };

  // Handle lesson change
  const handleLessonChange = (lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  // Get next/previous lessons
  const getAdjacentLessons = () => {
    if (!course?.curriculum) return { prev: null, next: null };

    let prevLesson = null;
    let nextLesson = null;
    let found = false;

    for (const chapter of course.curriculum) {
      for (let i = 0; i < chapter.lessons.length; i++) {
        if (chapter.lessons[i].lesson_title === currentLesson?.lesson_title) {
          found = true;
          // Previous lesson
          if (i > 0) {
            prevLesson = chapter.lessons[i - 1];
          } else {
            // Look in previous chapter
            const chapterIndex = course.curriculum.indexOf(chapter);
            if (chapterIndex > 0) {
              const prevChapter = course.curriculum[chapterIndex - 1];
              prevLesson = prevChapter.lessons[prevChapter.lessons.length - 1];
            }
          }
          // Next lesson
          if (i < chapter.lessons.length - 1) {
            nextLesson = chapter.lessons[i + 1];
          } else {
            // Look in next chapter
            const chapterIndex = course.curriculum.indexOf(chapter);
            if (chapterIndex < course.curriculum.length - 1) {
              const nextChapter = course.curriculum[chapterIndex + 1];
              nextLesson = nextChapter.lessons[0];
            }
          }
          break;
        }
      }
      if (found) break;
    }

    return { prev: prevLesson, next: nextLesson };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Course not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Left Section: Video Player */}
      <div className="flex-1 p-4 lg:p-6">
        <VideoPlayer
          videoUrl={currentLesson?.video_url}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
        />

        {/* Lesson Info */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {currentLesson?.lesson_title || "Select a Lesson"}
          </h1>
          <p className="text-gray-600 mb-4">{course.short_description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4" />
              <span>{currentLesson?.video_duration || "--:--"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Instructor: {course.instructor_name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Class: {course.class}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Subject: {course.subject}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Lessons Sidebar */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 shadow-sm p-4 lg:p-6 overflow-y-auto max-h-screen">
        <div className="sticky top-0 bg-white pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {course.title}
          </h2>
          <p className="text-sm text-gray-600 mb-2">
            Instructor: <span className="font-semibold">{course.instructor_name}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>{course.total_videos} lessons</span>
            <span>•</span>
            <span className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              {course.rating}
            </span>
            <span>•</span>
            <span>Class: {course.class}</span>
            <span>•</span>
            <span>Group: {course.group}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {course.curriculum?.map((chapter, chapterIndex) => (
            <div
              key={chapterIndex}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleChapter(chapterIndex)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {chapterIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {chapter.chapter_title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {chapter.lessons?.length} lessons
                    </p>
                  </div>
                </div>
                {expandedChapters.includes(chapterIndex) ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </button>

              {expandedChapters.includes(chapterIndex) && (
                <div className="border-t border-gray-200">
                  {chapter.lessons?.map((lesson, lessonIndex) => (
                    <button
                      key={lessonIndex}
                      onClick={() => handleLessonChange(lesson)}
                      className={`w-full flex items-center justify-between p-3 text-left transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                        currentLesson?.lesson_title === lesson.lesson_title
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          currentLesson?.lesson_title === lesson.lesson_title
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {lessonIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            currentLesson?.lesson_title === lesson.lesson_title
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}>
                            {lesson.lesson_title}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <PlayCircle className="w-3 h-3" />
                            <span>{lesson.video_duration}</span>
                          </div>
                        </div>
                      </div>
                      {currentLesson?.lesson_title === lesson.lesson_title && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}