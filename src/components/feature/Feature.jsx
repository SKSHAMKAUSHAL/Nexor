import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';

import img1 from '../../assets/photo1.jpg';
import img2 from '../../assets/photo2.jpg';
import img3 from '../../assets/photo3.jpg';
import img4 from '../../assets/photo4.jpg';

function Feature() {
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { mode, setFilterType } = context;

  const navigateToAllProducts = () => {
    setFilterType('');
    navigate('/allproducts');
  };

  const featureItems = [
    {
      id: 1,
      image: img1,
      category: 'NexorRunning',
      title: 'Power for Every Run',
      actionTitle: 'Shop'
    },
    {
      id: 2,
      image: img2,
      category: '',
      title: 'NexorAir Max',
      actionTitle: 'Shop'
    },
    {
      id: 3,
      image: img3,
      category: 'Shreyas Iyer',
      title: 'Athlete Picks',
      actionTitle: 'Shop'
    },
    {
      id: 4,
      image: img4,
      category: 'NexorTraining',
      title: 'Just Do the Work',
      actionTitle: 'Shop'
    }
  ];

  return (
    <section className="text-gray-600 body-font mb-10 w-full overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-0 md:px-5">
        <h2 className="text-3xl font-bold mb-8 text-left px-5 md:px-0" style={{ color: mode === 'dark' ? 'white' : 'black' }}>
          Featured
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-auto md:h-[1000px]">
          {featureItems.map((item) => (
            <div
              key={item.id}
              className="relative w-full h-[500px] md:h-full cursor-pointer group overflow-hidden"
              onClick={navigateToAllProducts}
            >
              <img
                src={item.image}
                alt={item.title || item.category}
                className="absolute w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-500 group-hover:bg-opacity-20" />
              <div className="absolute bottom-8 left-8 text-white text-left z-10 flex flex-col items-start w-full pr-8">
                {item.category && <p className="text-lg font-medium mb-1 drop-shadow-md">{item.category}</p>}
                {item.title && <h3 className="text-3xl font-bold mb-5 drop-shadow-lg">{item.title}</h3>}
                {!item.title && <div className="mb-5"></div>}
                <button 
                  className="bg-white text-black px-6 py-2 rounded-full text-base font-semibold hover:bg-gray-200 transition-colors"
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
