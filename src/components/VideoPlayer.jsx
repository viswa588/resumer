import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const VideoPlayer = ({ videoUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const videoRef = React.useRef(null);
  const containerRef = React.useRef(null);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle fullscreen change events
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title || 'Interview Recording'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="relative rounded-md overflow-hidden bg-black"
        >
          {videoUrl.includes('vimeo.com') ? (
            <iframe 
              src={`${videoUrl}?autoplay=0`}
              className="w-full aspect-video"
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
              title="Interview Recording"
            ></iframe>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100 || 0}
                    onChange={handleSeek}
                    className="w-full mx-2"
                  />
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={togglePlay}
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleMute}
                      className="text-white hover:bg-white hover:bg-opacity-20"
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  >
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;