import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { useContext, useEffect, useRef, useState } from 'react';
import myContext from '../../context/data/myContext';
import ResourceContext from '../../context/ResourceContext';
import VideoModal from '../videoModal/VideoModal';

function HeroSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(myContext);
  const resourceContext = useContext(ResourceContext);
  const videoRef = useRef(null);
  const { setFilterType } = context;
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Preload video when component mounts and on home page
  useEffect(() => {
    if (location.pathname === '/' && resourceContext) {
      resourceContext.preloadVideo('/hero-video.mp4', 'hero-video');
    }
  }, [location.pathname, resourceContext]);

  // Mark video as ready when it can play through
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resourceContext) return;

    const handleCanPlayThrough = () => {
      resourceContext.markResourceReady('hero-video');
    };

    video.addEventListener('canplaythrough', handleCanPlayThrough);
    return () => video.removeEventListener('canplaythrough', handleCanPlayThrough);
  }, [resourceContext]);

  // Handle ESC key to close video modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        setIsVideoModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isVideoModalOpen]);

  const navigateToAllProducts = () => {
    setFilterType('');
    navigate('/allproducts');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for better text readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 flex flex-col items-center mt-32 md:mt-48">

        {/* Top small text (Brand Name) */}
        <div className="flex items-center gap-4 mb-4 opacity-90">
          <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-white rounded-full"></div>
          <p className="text-white text-xs md:text-sm font-bold tracking-[0.4em] uppercase font-sans drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]">
            NEXOR FIT
          </p>
          <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-white rounded-full"></div>
        </div>

        {/* Main Headline */}
        <h1
          className="text-white text-[10vw] sm:text-[9vw] md:text-[90px] lg:text-[110px] xl:text-[130px] font-black uppercase italic leading-[0.85] tracking-tighter mb-6 drop-shadow-2xl"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          JUST DO THE WORK
        </h1>

        {/* Subtext */}
        <p className="text-white/90 text-sm md:text-lg lg:text-xl font-light tracking-wide font-sans max-w-xl mx-auto mb-10 drop-shadow-md">
          Premium gym wear engineered to go exactly as hard as you do.
        </p>

        {/* Buttons */}
        <div className="flex flex-row items-center justify-center gap-5">
          <button
            onClick={navigateToAllProducts}
            className="bg-white text-black px-10 py-3.5 rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-gray-200 hover:scale-105 transition-all duration-300 transform shadow-xl"
          >
            Explore
          </button>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/40 text-white px-10 py-3.5 rounded-full font-bold text-sm uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white hover:scale-105 transition-all duration-300 transform shadow-xl"
          >
            Watch <FaPlay className="text-[10px]" />
          </button>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/hero-video.mp4"
      />
    </div>
  );
}

export default HeroSection;
