import { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';

import sport1 from '../../assets/sport1.jpg';
import sport2 from '../../assets/sport2.jpg';
import sport3 from '../../assets/sport3.jpg';
import sport4 from '../../assets/sport4.jpg';
import sport5 from '../../assets/sport5.jpg';
import sport6 from '../../assets/sport6.jpg';

function ShopBySport() {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { mode, setFilterType } = context;
  const scrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleCardClick = () => {
    setFilterType('');
    navigate('/allproducts');
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -(416 * 4), behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 416 * 4, behavior: 'smooth' });
    }
  };

  const sports = [
    { id: 1, image: sport1, title: 'Running' },
    { id: 2, image: sport2, title: 'Training' },
    { id: 3, image: sport3, title: 'Sportswear' },
    { id: 4, image: sport4, title: 'Cricket' },
    { id: 5, image: sport5, title: 'Football' },
    { id: 6, image: sport6, title: 'Basketball' },
  ];

  return (
    <section className="text-gray-600 body-font mb-10 w-full overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-left m-0" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
            Shop by Sport
          </h2>
        </div>
        
        <div className="relative group">
          {/* Left Scroll Arrow */}
          {canScrollLeft && (
            <button 
              onClick={scrollLeft}
              className="absolute left-4 top-[40%] -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-black p-4 rounded-full shadow-md transition-all hidden md:flex items-center justify-center opacity-0 group-hover:opacity-90 hover:!opacity-100"
              aria-label="Scroll left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}

          {/* Right Scroll Arrow */}
          {canScrollRight && (
            <button 
              onClick={scrollRight}
              className="absolute right-4 top-[40%] -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-black p-4 rounded-full shadow-md transition-all hidden md:flex items-center justify-center opacity-0 group-hover:opacity-90 hover:!opacity-100"
              aria-label="Scroll right"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sports.map((sport) => (
              <div
                key={sport.id}
                className={`w-[280px] sm:w-[400px] flex-shrink-0 cursor-pointer snap-start group p-3 sm:p-4 rounded-xl transition-all duration-300 flex flex-col ${mode === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={handleCardClick}
              >
                <div className="relative w-full aspect-[4/5] overflow-hidden mb-4 rounded-lg flex-shrink-0">
                  <img
                    src={sport.image}
                    alt={sport.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-medium px-2 pb-2 mt-auto" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
                  {sport.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
        `}</style>
      </div>
    </section>
  );
}

export default ShopBySport;
