import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "../../components/filter/Filter";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/data/myContext";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { Transition, Dialog } from "@headlessui/react";

function Allproducts() {
  const context = useContext(myContext);
  const {
    product,
    searchkey,
    filterType,
    filterPrice,
    filterSize,
    filterColor,
    wishlist,
    getWishlistData,
    addToWishlistBackend,
    removeFromWishlistBackend,
  } = context;

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.user?.uid;

  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showDesktopFilter, setShowDesktopFilter] = useState(true);

  const getProductImages = (item) => {
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    return [item.imageUrl];
  };

  useEffect(() => {
    if (userId) {
      getWishlistData(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    if (!userId) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }
    const isInWishlist = wishlist.some(item => item.productId === product.id);
    if (isInWishlist) {
      const wishlistItem = wishlist.find(item => item.productId === product.id);
      removeFromWishlistBackend(wishlistItem.id, userId);
    } else {
      addToWishlistBackend(product, userId);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const inPriceRange = (price, selectedRange) => {
    if (!selectedRange) return true;
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice)) return false;

    switch (selectedRange) {
      case 'Under ₹ 2,500':
        return numericPrice <= 2500;
      case '₹ 2,501 - ₹ 5,000':
        return numericPrice >= 2501 && numericPrice <= 5000;
      case '₹ 5,001 - ₹ 7,500':
        return numericPrice >= 5001 && numericPrice <= 7500;
      case 'Over ₹ 7,500':
        return numericPrice > 7500;
      default:
        return true;
    }
  };

  const matchType = (item, typeFilter) => {
    if (!typeFilter) return true;
    const normalized = typeFilter.toLowerCase();
    const itemType = (item.type || '').toLowerCase();
    const category = (item.category || '').toLowerCase();

    if (normalized === 'man') return itemType === 'man' || category.includes('man') || category.includes('Man');
    if (normalized === 'Woman') return itemType === 'Woman' || category.includes('Woman') || category.includes('Woman');
    if (normalized === 'child') return itemType === 'child' || category.includes('child') || category.includes('kid');

    return itemType === normalized || category.includes(normalized);
  };

  const getFilteredProducts = () => {
    let filtered = product
      .filter((obj) => {
        const searchLower = searchkey.toLowerCase();
        if (!searchLower) return true;
        return (
          (obj.title || '').toLowerCase().includes(searchLower) ||
          (obj.category || '').toLowerCase().includes(searchLower) ||
          (obj.colors && obj.colors.some(c => c.toLowerCase().includes(searchLower))) ||
          (obj.description && obj.description.toLowerCase().includes(searchLower))
        );
      })
      .filter((obj) => matchType(obj, filterType))
      .filter((obj) => inPriceRange(obj.price, filterPrice))
      .filter((obj) => filterSize && filterSize.length > 0 ? filterSize.some((size) => obj.sizes && obj.sizes.includes(size)) : true)
      .filter((obj) => filterColor && filterColor.length > 0 ? filterColor.some((color) => obj.colors && obj.colors.some((itemColor) => itemColor.toLowerCase() === color.toLowerCase())) : true)

    if (sortBy === "price-low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Layout>
      <div className="bg-white min-h-screen font-sans">
        
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sticky top-0 bg-white z-20 py-4">
            <h1 className="text-[24px] tracking-tight font-medium text-[#111111] font-oswald mb-4 md:mb-0 capitalize">
              {searchkey ? `Search Results: ${searchkey}` : filterType ? (['man', 'Woman', 'child'].includes(filterType.toLowerCase()) ? `${filterType.replace('man', 'Man').replace('child', 'kid')} Clothing` : filterType) : 'All Products'} ({filteredProducts.length})
            </h1>
            
            <div className="flex items-center text-[#111111] gap-6">
              <button onClick={() => setShowMobileFilter(true)} className="lg:hidden flex items-center gap-2 text-sm font-medium hover:text-gray-600">
                Show Filters
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 4H3M21 12H3M21 20H3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button onClick={() => setShowDesktopFilter(!showDesktopFilter)} className="hidden lg:flex items-center gap-2 text-sm font-medium hover:text-gray-600">
                {showDesktopFilter ? 'Hide Filters' : 'Show Filters'}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 4H3M21 12H3M21 20H3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="flex items-center gap-2 text-sm font-medium cursor-pointer hover:text-gray-600 relative">
                Sort By
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="absolute opacity-0 w-full h-full cursor-pointer inset-0 border-none"
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low-High</option>
                  <option value="price-high">Price: High-Low</option>
                  <option value="name">Alphabetical</option>
                </select>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-start relative w-full">
            {/* Sidebar Filter Component */}
            {showDesktopFilter && (
            <div className="hidden lg:block w-[260px] shrink-0 sticky top-24 self-start mr-8">
              <Filter />
            </div>
            )}

            {/* Main Product Grid Content */}
            <div className="flex-1 w-full transition-all duration-300">
              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <h2 className="text-xl font-medium text-[#111111] mb-2 font-oswald">No exact matches</h2>
                  <p className="text-gray-500 text-sm">Please try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className={`grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-10 ${showDesktopFilter ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-5'}`}>
              {filteredProducts.map((item, index) => {
                const { title, price, id, category } = item;
                const isInWishlist = wishlist.some(wishItem => wishItem.productId === id);
                const productImages = getProductImages(item);
                
                return (
                  <div
                    key={index}
                    className="group flex flex-col relative"
                  >
                    {/* Image Container */}
                    <div 
                      className="relative bg-[#F5F5F5] aspect-[4/5] overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/productinfo/${id}`)}
                    >
                      {/* Primary Image */}
                      <img
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0"
                        src={productImages[0]}
                        alt={title}
                        loading="lazy"
                      />
                      {/* Secondary Image (Visible on Hover) */}
                      {productImages.length > 1 && (
                        <img
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                          src={productImages[1]}
                          alt={`${title} alternate`}
                          loading="lazy"
                        />
                      )}
                      
                      <button
                        onClick={(e) => toggleWishlist(e, item)}
                        className="absolute top-3 right-3 p-2 rounded-full cursor-pointer z-10 hover:bg-white transition-colors"
                      >
                         <svg 
                           className={`w-5 h-5 transition-colors ${isInWishlist ? "fill-black stroke-black" : "fill-transparent stroke-black hover:stroke-gray-500"}`} 
                           viewBox="0 0 24 24"
                         >
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                         </svg>
                      </button>
                    </div>

                    {/* Product Details - Nikelayout */}
                    <div className="pt-3 flex flex-col justify-start">
                      {/* Price / Title Row */}
                      <div className="flex flex-col mb-1 relative">
                        {item.justIn && <div className="text-[#9E3500] font-medium text-xs mb-1">Just In</div>}
                        <h2 
                          className="text-[#111111] font-medium text-[16px] leading-tight cursor-pointer focus:outline-none"
                          onClick={() => navigate(`/productinfo/${id}`)}
                        >
                          {title}
                        </h2>
                        <h3 className="text-[#757575] text-[16px] leading-tight mt-1">
                          {category}
                        </h3>
                        <div className="mt-1">
                           {item.colors && item.colors.length > 0 && (
                            <p className="text-[#757575] text-[14px] leading-tight">
                              {item.colors.slice(0, 3).join(', ')}{item.colors.length > 3 ? '...' : ''}
                            </p>
                           )}
                        </div>
                      </div>
                      
                      <div className="text-[#111111] font-medium text-[16px] mt-2">
                        ₹ {price}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <Transition.Root show={showMobileFilter} as={"div"}>
          <Dialog as="div" className="relative z-40" onClose={setShowMobileFilter}>
            <Transition.Child
              as={"div"}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowMobileFilter(false)} />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="absolute inset-0 overflow-hidden">
                <Transition.Child
                  as={"div"}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md bg-white shadow-xl">
                    <div className="flex flex-col h-full overflow-y-auto">
                      <div className="flex items-center justify-between p-4 border-b">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">Filters</Dialog.Title>
                        <button
                          type="button"
                          onClick={() => setShowMobileFilter(false)}
                          className="inline-flex items-center justify-center rounded-md p-2"
                        >
                          <FaTimes className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4">
                        <Filter />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </Layout>
  );
}

export default Allproducts;