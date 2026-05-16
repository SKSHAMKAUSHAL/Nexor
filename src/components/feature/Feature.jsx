import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import ResourceContext from '../../context/ResourceContext';

import img1 from '../../assets/photo1.jpg';
import img2 from '../../assets/photo2.jpg';
import img3 from '../../assets/photo3.jpg';
import img4 from '../../assets/photo4.jpg';

function Feature() {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(myContext);
  const resourceContext = useContext(ResourceContext);
  const { mode, setFilterType } = context;

  // Preload all feature images on home page
  useEffect(() => {
    if (location.pathname === '/' && resourceContext) {
      const images = [
        { src: img1, id: 'feature-img-1' },
        { src: img2, id: 'feature-img-2' },
        { src: img3, id: 'feature-img-3' },
        { src: img4, id: 'feature-img-4' }
      ];

      images.forEach(({ src, id }) => {
        resourceContext.preloadImage(src, id);
      });
    }
  }, [location.pathname, resourceContext]);

  const navigateToAllProducts = () => {
    setFilterType('');
    navigate('/allproducts');
  };

  const featureItems = [
    {
      id: 1,
      image: img1,
       category: 'Built for Performance',
      title: 'Lightweight activewear designed to keep up with you',
      actionTitle: 'Shop'
    },
    {
      id: 2,
      image: img2,
      category: 'Minimal Comfort Wear',
      title: 'Relaxed essentials with effortless style',
      actionTitle: 'Shop'
    },
    {
      id: 3,
      image: img3,
     category: 'Street Style Collective',
      title: 'Modern comfort made for everyday movement',
      actionTitle: 'Shop'
    },
    {
      id: 4,
      image: img4,
      category: 'Train Beyond Limits',
      title: 'Strength, focus and teamwork in every session',
      actionTitle: 'Shop'
    }
  ];

  return (
    <section className="text-gray-600 body-font mb-10 w-full overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-0 md:px-5">
        <h2 className="text-4xl md:text-5xl font-black mb-8 text-left px-5 md:px-0 font-barlow uppercase tracking-tight" style={{ color: mode === 'dark' ? 'white' : '#111' }}>
          Featured
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 h-auto md:h-[1000px]">
          {featureItems.map((item) => (
            <div
              key={item.id}
              className="relative w-full h-[500px] md:h-full cursor-pointer group overflow-hidden md:rounded-xl"
              onClick={navigateToAllProducts}
            >
              <img
                src={item.image}
                alt={item.title || item.category}
                className="absolute w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white z-10 flex flex-col items-start transform transition-transform duration-500 group-hover:-translate-y-2">
                {item.category && <p className="font-sans font-semibold uppercase tracking-widest text-xs md:text-sm text-gray-300 mb-3">{item.category}</p>}
                {item.title && <h3 className="font-barlow font-bold text-3xl md:text-4xl lg:text-5xl uppercase leading-none tracking-tight mb-6">{item.title}</h3>}
                {!item.title && <div className="mb-6"></div>}
                <button 
                  className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-gray-200 transition-all duration-300 transform shadow-lg"
                >
                  {item.actionTitle}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feature;
