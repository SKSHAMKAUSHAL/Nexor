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
      <div className="relative w-full h-full flex items-center justify-center px-4">
        {/* Close Button - Top Right */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-[9999] bg-white/20 hover:bg-white/40 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
          aria-label="Close video"
          title="Close (Esc)"
        >
          <IoClose className="text-white text-3xl" />
        </button>

        {/* Video Player */}
        <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={false}
          >
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause Button - Center */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all duration-300 group">
            <button
              onClick={handlePlayPause}
              className="bg-white/80 hover:bg-white text-black rounded-full p-4 transition-all duration-300 transform hover:scale-110 shadow-lg group-hover:opacity-100 opacity-80"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <FaPause className="text-2xl" />
              ) : (
                <FaPlay className="text-2xl ml-1" />
              )}
            </button>
          </div>

          {/* Video Controls Bar - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={0}
              className="w-full cursor-pointer accent-white"
              onChange={(e) => {
                if (videoRef.current) {
                  videoRef.current.currentTime =
                    (e.target.value / 100) * videoRef.current.duration;
                }
              }}
              style={{
                background: `linear-gradient(to right, white 0%, white ${
                  videoRef.current
                    ? (videoRef.current.currentTime /
                        videoRef.current.duration) *
                      100
                    : 0
                }%, rgba(255,255,255,0.3) ${
                  videoRef.current
                    ? (videoRef.current.currentTime /
                        videoRef.current.duration) *
                      100
                    : 0
                }%, rgba(255,255,255,0.3) 100%)`,
              }}
            />
            <div className="text-white text-xs mt-2 flex justify-between">
              <span>
                {videoRef.current
                  ? `${Math.floor(videoRef.current.currentTime)}s`
                  : '0s'}
              </span>
              <span>
                {videoRef.current
                  ? `${Math.floor(videoRef.current.duration)}s`
                  : '0s'}
              </span>
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
