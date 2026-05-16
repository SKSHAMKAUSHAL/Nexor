import React, { useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaPlay, FaPause } from 'react-icons/fa';
import PropTypes from 'prop-types';

function VideoModal({ isOpen, onClose, videoSrc = '/hero-video.mp4' }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);

  // Auto-play when modal opens
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Dark Overlay Background */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>

      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center group bg-black">
        {/* Close Button - Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-[9999] bg-white/20 hover:bg-white/40 rounded-full p-3 transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          aria-label="Close video"
          title="Close (Esc)"
        >
          <IoClose className="text-white text-3xl" />
        </button>

        {/* Video Player */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-contain cursor-pointer"
          autoPlay
          playsInline
          muted={false}
          onClick={handlePlayPause}
        >
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Bar - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end">
          
          <div className="flex items-center gap-6 w-full max-w-[1600px] mx-auto px-4 md:px-12">
            {/* Play/Pause Button - Bottom Left */}
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-gray-300 transition-transform transform hover:scale-110 flex-shrink-0"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <FaPause className="text-2xl" />
              ) : (
                <FaPlay className="text-2xl ml-1" />
              )}
            </button>

            {/* Progress Bar Container */}
            <div className="flex-1 flex flex-col gap-2 relative group/progress">
              <input
                type="range"
                min="0"
                max="100"
                value={videoRef.current && videoRef.current.duration ? (videoRef.current.currentTime / videoRef.current.duration) * 100 : 0}
                className="w-full h-1.5 cursor-pointer accent-white bg-white/30 rounded-full appearance-none overflow-hidden"
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = (e.target.value / 100) * videoRef.current.duration;
                  }
                }}
                style={{
                  background: `linear-gradient(to right, white 0%, white ${
                    videoRef.current && videoRef.current.duration
                      ? (videoRef.current.currentTime / videoRef.current.duration) * 100
                      : 0
                  }%, rgba(255,255,255,0.3) ${
                    videoRef.current && videoRef.current.duration
                      ? (videoRef.current.currentTime / videoRef.current.duration) * 100
                      : 0
                  }%, rgba(255,255,255,0.3) 100%)`,
                }}
              />
              <div className="text-white/80 text-sm font-medium flex justify-between tracking-wider font-barlow">
                <span>
                  {videoRef.current
                    ? `${Math.floor(videoRef.current.currentTime)}s`
                    : '0s'}
                </span>
                <span>
                  {videoRef.current && videoRef.current.duration
                    ? `${Math.floor(videoRef.current.duration)}s`
                    : '0s'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-6 left-6 text-white/60 text-xs backdrop-blur-sm bg-black/20 px-3 py-2 rounded">
        <p>Press <span className="font-semibold">ESC</span> to close</p>
      </div>
    </div>
  );
}

VideoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  videoSrc: PropTypes.string,
};

export default VideoModal;
