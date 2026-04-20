import { useContext, useState } from 'react';
import myContext from '../../context/data/myContext';

function Filter() {
  const context = useContext(myContext);
  const {
    filterType,
    setFilterType,
    filterPrice,
    setFilterPrice,
    filterSize,
    setFilterSize,
    filterColor,
    setFilterColor,
    product,
  } = context;

  // Dynamically extract all unique colors from all products that have colors filled from the backend
  const extractUniqueColors = () => {
    let allColors = new Set();
    product.forEach(item => {
      if (item.colors && Array.isArray(item.colors) && item.colors.length > 0) {
        item.colors.forEach(c => allColors.add(c.trim()));
      }
    });
    return Array.from(allColors).sort();
  };

  const dynamicColors = extractUniqueColors();

  const extractUniqueCategories = () => {
    let allCategories = new Set();
    product.forEach(item => {
      if (item.category) {
        // Typically categories might be comma separated or just single strings.
        // Let's assume they are just strings like "Shoes", "T-Shirts", "Man Shoes" etc.
        // If we want to show clothing dynamically, we just extract the unique category field values.
        allCategories.add(item.category.trim());
      }
    });
    // Filter out simple genders if they are standalone categories, as we have a separate Gender section
    return Array.from(allCategories).filter(c => !['Man', 'Woman', 'kid', 'child'].includes(c.toLowerCase())).sort();
  };

  const dynamicCategories = extractUniqueCategories();

  // Size list exactly as requested (sorted logically if we were doing custom logic, but explicit array provided by user)
  const sizeList = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  const filterSections = [
    { title: 'Gender', options: ['Man', 'Woman', 'kid'] },
    { title: 'Size', options: sizeList },
    { title: 'Shop By Price', options: ['Under ₹ 2,500', '₹ 2,501 - ₹ 5,000', '₹ 5,001 - ₹ 7,500', 'Over ₹ 7,500'] },
  ];

  // Only add the Colour section if there are actually colors found in the database.
  if (dynamicColors.length > 0) {
     filterSections.push({ title: 'Colour', options: dynamicColors });
  }

  const [openSections, setOpenSections] = useState({
     'Size': true, // Keep size open default to showcase
     'Colour': true 
  });

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="w-full lg:w-[260px] flex-shrink-0 lg:pr-6 mb-8 lg:mb-0 lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] lg:overflow-y-auto no-scrollbar">
      {/* Top Filter Summary */}
      <div className="mb-6 hidden lg:block">
        <ul className="space-y-3 text-[15px] font-medium text-[#111111] mb-8">
          <li onClick={() => { setFilterType(''); context.setSearchkey(''); }} className={`cursor-pointer hover:text-gray-600 ${!filterType ? 'font-bold' : ''}`}>All Products</li>
          {dynamicCategories.map((cat, index) => (
            <li key={index} onClick={() => setFilterType(cat)} className={`cursor-pointer hover:text-gray-600 ${filterType === cat ? 'font-bold' : ''}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 w-full mb-4 hidden lg:block"></div>

      {filterSections.map((section) => (
        <div key={section.title} className="border-b border-gray-200 py-4">
          <button
            onClick={() => toggleSection(section.title)}
            className="flex items-center justify-between w-full text-left focus:outline-none"
          >
            <span className="font-medium text-[16px] text-[#111111]">{section.title}</span>
            <svg
              className={`w-4 h-4 transform transition-transform duration-200 ${
                openSections[section.title] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Accordion Content */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openSections[section.title] ? 'max-h-[1000px] mt-4 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {section.title === 'Size' ? (
                <div className="grid grid-cols-3 gap-2">
                    {section.options.map((option, idx) => {
                      const isSelected = filterSize?.includes(option);
                      return (
                        <button 
                            key={idx} 
                            onClick={() => {
                                if (isSelected) {
                                    setFilterSize(filterSize.filter(size => size !== option));
                                } else {
                                    setFilterSize([...(filterSize || []), option]);
                                }
                            }}
                            className={`border rounded py-2 text-center text-sm font-medium transition-colors ${
                              isSelected ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'
                            }`}>
                            {option}
                        </button>
                      );
                    })}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                  {section.options.map((option, idx) => {
                    let isChecked = false;
                    if (section.title === 'Gender') {
                      isChecked = filterType === (option.toLowerCase() === 'kid' ? 'child' : option.toLowerCase());
                    } else if (section.title === 'Colour') {
                      isChecked = filterColor?.includes(option);
                    } else if (section.title === 'Shop By Price') {
                      isChecked = filterPrice === option;
                    }

                    return (
                    <label key={idx} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        onClick={() => {
                           if(section.title === 'Gender') {
                               const newVal = option.toLowerCase() === 'kid' ? 'child' : option.toLowerCase();
                               setFilterType(filterType === newVal ? '' : newVal);
                           } else if (section.title === 'Colour') {
                               if (isChecked) {
                                   setFilterColor(filterColor.filter(color => color !== option));
                               } else {
                                   setFilterColor([...(filterColor || []), option]);
                               }
                           } else if (section.title === 'Shop By Price') {
                               setFilterPrice(filterPrice === option ? '' : option);
                           }
                        }}
                        checked={isChecked}
                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer appearance-none checked:bg-black checked:border-black transition-colors align-middle accent-black"
                        readOnly
                      />
                      <span className="ml-3 text-[15px] text-[#111111] group-hover:text-gray-600 select-none">
                        {option}
                      </span>
                    </label>
                  );})}
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Filter;
