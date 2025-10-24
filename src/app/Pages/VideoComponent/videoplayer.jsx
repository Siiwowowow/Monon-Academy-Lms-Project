import React, { useRef, useEffect, useState, useCallback } from "react";
import { IoPauseCircleOutline, IoPlayCircleOutline, IoVolumeHighOutline, IoVolumeMuteOutline } from "react-icons/io5";
import { MdFullscreen, MdOutlineFullscreenExit } from "react-icons/md";
import { RiForward10Line, RiReplay10Line } from "react-icons/ri";

const VideoPlayer = () => {
  const youtubeUrl = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";
  const containerRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const playerRef = useRef(null);
  const apiScriptLoaded = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
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
    const regex = /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&?\n]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(youtubeUrl);

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
          togglePlay();
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
  }, [playerReady, volume, playbackRate, showControls, currentTime, duration]);

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
      event.target.setVolume(volume);
    } catch (error) {
      console.log('Error in onPlayerReady:', error);
    }
  }, [volume]);

  const onPlayerStateChange = useCallback((event) => {
    if (!window.YT) return;

    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        resetHideTimeout();
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        setShowControls(true);
        setShowCenterPlay(true);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
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
            const currentTime = playerRef.current.getCurrentTime();
            setCurrentTime(currentTime);
          }
        } catch (error) {
          console.log('Error getting current time:', error);
        }
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playerReady]);

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
          'origin': window.location.origin || 'http://localhost:3000'
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
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
    resetHideTimeout();
  }, [isPlaying, resetHideTimeout]);

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
      <div className="mx-auto max-w-4xl p-6 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl text-center">
        <div className="text-2xl font-bold mb-2">❌ Invalid YouTube URL</div>
        <p className="opacity-90">Please check the youtubeUrl constant</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`mx-auto w-full bg-black shadow-2xl transition-all duration-300 select-none relative group ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ' max-w-2xl'
      }`}
      onMouseEnter={handleContainerInteraction}
      onMouseMove={handleContainerInteraction}
      onMouseLeave={handleMouseLeave}
      onClick={togglePlay}
    >
      {/* Video Player */}
      <div className={`relative bg-black ${isFullscreen ? 'h-screen' : 'h-80 sm:h-96 md:h-[450px] lg:h-[450px]'}`}>
        
        {/* YouTube Player Container */}
        <div id="youtube-player" className="w-full h-full  overflow-hidden">
          {isLoading && !error && (
            <div className="w-full h-full bg-gradient-to-br  flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white text-lg font-medium">Loading video...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/95 to-red-800/95 flex items-center justify-center p-6 rounded-3xl">
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

        {/* Loading Overlay */}
        

      

        {/* Controls Overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t  via-transparent to-transparent transition-all duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
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

export default VideoPlayer;