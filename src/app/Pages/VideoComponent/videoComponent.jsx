import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaVolumeDown,
  FaExpand,
  FaCompress,
  FaStepBackward,
  FaStepForward,
  FaRegWindowRestore,
} from "react-icons/fa";

export default function CustomVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [showSkipIndicator, setShowSkipIndicator] = useState({ show: false, direction: '', time: 0 });
  const [isSeeking, setIsSeeking] = useState(false);

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const skipTimeoutRef = useRef(null);
  const lastTapRef = useRef(0);
  const tapTimeoutRef = useRef(null);

  // Video source - replace with your video URL
  const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // Keyboard shortcuts - FIXED: Proper dependency array
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle if video element exists and we're not in an input field
      if (!videoRef.current || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

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
          skip(-10);
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          skip(10);
          break;
        case '>':
        case '.':
          e.preventDefault();
          changePlaybackRate();
          break;
        case '<':
        case ',':
          e.preventDefault();
          decreasePlaybackRate();
          break;
        case 'i':
          e.preventDefault();
          togglePictureInPicture();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          const percent = parseInt(e.key) / 10;
          seekToPercentage(percent);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []); // Empty dependency array - functions are stable

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      if (!isSeeking && video) {
        setCurrentTime(video.currentTime);
      }
    };

    const updateDuration = () => {
      if (video) setDuration(video.duration || 0);
    };
    
    const updateBuffered = () => {
      if (video && video.buffered.length > 0 && video.duration > 0) {
        setBuffered((video.buffered.end(0) / video.duration) * 100);
      }
    };

    const handleEnded = () => setIsPlaying(false);
    const handleEnterPiP = () => setIsPictureInPicture(true);
    const handleLeavePiP = () => setIsPictureInPicture(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("progress", updateBuffered);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);

    // Initialize duration if already loaded
    if (video.duration) {
      updateDuration();
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("progress", updateBuffered);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, [isSeeking]);

  // Volume and mute effects
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Playback rate effect
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Controls auto-hide
  useEffect(() => {
    hideControls();
    return () => {
      clearTimeout(controlsTimeoutRef.current);
      clearTimeout(skipTimeoutRef.current);
      clearTimeout(tapTimeoutRef.current);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing video:", error);
      });
    }
    showControlsTemporarily();
  };

  const handleVideoClick = (e) => {
    // Only toggle play if not clicking on controls or progress bar
    if (!e.target.closest('.controls') && !e.target.closest('.progress-bar')) {
      togglePlay();
    }
  };

  // Mobile double tap handler
  const handleVideoTouch = (e) => {
    e.preventDefault();
    const currentTime = Date.now();
    const tapLength = currentTime - lastTapRef.current;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      handleDoubleTap(e);
      clearTimeout(tapTimeoutRef.current);
    } else {
      // Single tap - show/hide controls
      tapTimeoutRef.current = setTimeout(() => {
        setShowControls(prev => !prev);
      }, 300);
    }
    
    lastTapRef.current = currentTime;
  };

  const handleDoubleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const tapX = touch.clientX - rect.left;
    const width = rect.width;
    
    if (tapX < width / 2) {
      skip(-10);
    } else {
      skip(10);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const progress = progressRef.current;
    if (!progress || !videoRef.current) return;

    const rect = progress.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    
    setIsSeeking(true);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
    
    setTimeout(() => setIsSeeking(false), 100);
    showControlsTemporarily();
  };

  const seekToPercentage = (percent) => {
    if (!videoRef.current) return;
    const newTime = percent * duration;
    setIsSeeking(true);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
    setTimeout(() => setIsSeeking(false), 100);
    showControlsTemporarily();
  };

  const skip = (seconds) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    setIsSeeking(true);
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
    
    setShowSkipIndicator({
      show: true,
      direction: seconds > 0 ? 'forward' : 'backward',
      time: Math.abs(seconds)
    });
    
    clearTimeout(skipTimeoutRef.current);
    skipTimeoutRef.current = setTimeout(() => {
      setShowSkipIndicator({ show: false, direction: '', time: 0 });
      setIsSeeking(false);
    }, 1000);
    
    showControlsTemporarily();
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    showControlsTemporarily();
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    setIsMuted(!isMuted);
    showControlsTemporarily();
  };

  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    const player = playerRef.current;
    if (!player) return;
    
    if (!isFullscreen) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen();
      } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    showControlsTemporarily();
  };

  const togglePictureInPicture = async (e) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    
    try {
      if (!isPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
    showControlsTemporarily();
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const changePlaybackRate = (e) => {
    if (e) e.stopPropagation();
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
    showControlsTemporarily();
  };

  const decreasePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const prevIndex = (currentIndex - 1 + rates.length) % rates.length;
    setPlaybackRate(rates[prevIndex]);
    showControlsTemporarily();
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    if (clickX < width / 2) {
      skip(-10);
    } else {
      skip(10);
    }
  };

  const hideControls = () => {
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    hideControls();
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeMute />;
    if (volume < 0.5) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  return (
    <div 
      ref={playerRef}
      className="relative bg-black rounded-xl shadow-2xl w-full max-w-6xl mx-auto overflow-hidden select-none aspect-video"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={hideControls}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain cursor-pointer"
        onClick={handleVideoClick}
        onDoubleClick={handleDoubleClick}
        onTouchEnd={handleVideoTouch}
        preload="metadata"
      />

      {/* Skip Indicator */}
      {showSkipIndicator.show && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/70 text-white px-4 py-3 rounded-lg flex items-center space-x-3 sm:px-6 sm:py-4">
            {showSkipIndicator.direction === 'forward' ? (
              <FaStepForward className="text-lg sm:text-xl" />
            ) : (
              <FaStepBackward className="text-lg sm:text-xl" />
            )}
            <span className="text-base sm:text-lg font-semibold">
              {showSkipIndicator.time} seconds {showSkipIndicator.direction}
            </span>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <div 
        className={`controls absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="progress-bar relative w-full h-1.5 sm:h-2 bg-gray-600 rounded-full mb-3 sm:mb-4 cursor-pointer group"
          onClick={handleSeek}
        >
          {/* Buffered Progress */}
          <div 
            className="absolute h-full bg-gray-400 rounded-full transition-all duration-200"
            style={{ width: `${buffered}%` }}
          />
          {/* Played Progress */}
          <div 
            className="absolute h-full bg-red-600 rounded-full transition-all duration-200"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
          {/* Progress Thumb */}
          <div 
            className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full -mt-1 transform -translate-x-1.5 sm:-translate-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-red-500 transition-colors text-base sm:text-lg flex-shrink-0"
              title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skip(-10)}
              className="text-white hover:text-red-500 transition-colors text-base sm:text-lg flex-shrink-0 hidden sm:block"
              title="Skip back 10s (←)"
            >
              <FaStepBackward />
            </button>
            
            <button
              onClick={() => skip(10)}
              className="text-white hover:text-red-500 transition-colors text-base sm:text-lg flex-shrink-0 hidden sm:block"
              title="Skip forward 10s (→)"
            >
              <FaStepForward />
            </button>

            {/* Volume Controls */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={toggleMute}
                className="text-white hover:text-red-500 transition-colors text-base sm:text-lg"
                title={isMuted ? "Unmute (M)" : "Mute (M)"}
              >
                {getVolumeIcon()}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 accent-red-600 cursor-pointer hidden sm:block"
              />
            </div>

            {/* Time Display */}
            <div className="text-white text-xs sm:text-sm font-mono flex-shrink-0 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Playback Rate */}
            <button
              onClick={changePlaybackRate}
              className="text-white hover:text-red-500 transition-colors text-xs sm:text-sm font-medium px-2 py-1 rounded bg-black/50 min-w-[3rem]"
              title="Playback rate (>)"
            >
              {playbackRate}x
            </button>

            {/* Picture in Picture */}
            <button
              onClick={togglePictureInPicture}
              className="text-white hover:text-red-500 transition-colors text-base sm:text-lg"
              title="Picture in Picture (I)"
            >
              <FaRegWindowRestore />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-red-500 transition-colors text-base sm:text-lg"
              title={isFullscreen ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>

      {/* Play/Pause Overlay */}
      {!isPlaying && showControls && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          onClick={handleVideoClick}
        >
          <button
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 sm:p-6 transition-all hover:scale-110"
            title="Play (Space)"
          >
            <FaPlay className="text-2xl sm:text-3xl" />
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {showControls && (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 text-white text-xs p-2 sm:p-3 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <kbd className="px-1 bg-gray-600 rounded min-w-[2rem] text-center">Space</kbd>
              <span>Play/Pause</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <kbd className="px-1 bg-gray-600 rounded min-w-[2rem] text-center">F</kbd>
              <span>Fullscreen</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <kbd className="px-1 bg-gray-600 rounded min-w-[2rem] text-center">M</kbd>
              <span>Mute</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <kbd className="px-1 bg-gray-600 rounded min-w-[2rem] text-center">←</kbd>
              <span>-10s</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <kbd className="px-1 bg-gray-600 rounded min-w-[2rem] text-center">→</kbd>
              <span>+10s</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <kbd className="px-1 bg-gray-600 rounded min-w-[2rem] text-center">I</kbd>
              <span>PiP</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Instructions */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none sm:hidden">
        <div className="bg-black/60 text-white text-xs px-3 py-2 rounded-lg opacity-0 transition-opacity duration-300"
             style={{ opacity: showControls ? 1 : 0 }}>
          Double tap left/right to skip 10s
        </div>
      </div>
    </div>
  );
} 