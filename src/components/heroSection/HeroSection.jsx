import { useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import { useContext } from 'react';
import myContext from '../../context/data/myContext';

function HeroSection() {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { setFilterType } = context;

  const navigateToAllProducts = () => {
    setFilterType('');
    navigate('/allproducts');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background Video */}
      <video
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
        
        {/* Top small text */}
        <p className="text-white text-sm md:text-md font-bold mb-2 tracking-wide font-sans">
          NexorTraining
        </p>

        {/* Main Headline */}
        <h1 
          className="text-white text-[10vw] sm:text-[9vw] md:text-[90px] lg:text-[110px] xl:text-[130px] font-black uppercase leading-[0.8] tracking-tighter mb-4"
          style={{ fontFamily: "'Oswald', sans-serif" }}
        >
          JUST DO THE WORK
        </h1>

        {/* Subtext */}
        <p className="text-white text-sm md:text-lg font-medium mb-8">
          Gym wear that goes as hard as you do.
        </p>

        {/* Buttons */}
        <div className="flex flex-row items-center justify-center gap-4">
          <button
            onClick={navigateToAllProducts}
            className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm md:text-base hover:bg-gray-200 transition-colors shadow-lg"
          >
            Explore
          </button>
          <button
            onClick={navigateToAllProducts}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm md:text-base hover:bg-gray-200 transition-colors shadow-lg"
          >
            Watch <FaPlay className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
