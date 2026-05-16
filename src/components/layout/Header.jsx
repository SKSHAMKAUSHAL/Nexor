import { Fragment, useContext, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiUser, FiLogOut, FiTag, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import myContext from '../../context/data/myContext';
import { motion, AnimatePresence } from 'framer-motion';

const MEGA_MENU_DATA = [
  {
    id: 'man',
    label: 'Men',
    columns: [
      {
        title: 'Clothing',
        links: [
          { label: 'All Clothing', href: '/allproducts?category=man&subcategory=clothing' },
          { label: 'T-Shirts & Tops', href: '/allproducts?category=man&subcategory=t-shirts' },
          { label: 'Hoodies & Sweatshirts', href: '/allproducts?category=man&subcategory=hoodies' },
          { label: 'Jackets & Vests', href: '/allproducts?category=man&subcategory=jackets' },
          { label: 'Pants & Tights', href: '/allproducts?category=man&subcategory=pants' },
          { label: 'Shorts', href: '/allproducts?category=man&subcategory=shorts' },
        ],
      },
      {
        title: 'Featured',
        links: [
          { label: 'New Releases', href: '/allproducts?category=man&sort=new' },
          { label: 'Best Sellers', href: '/allproducts?category=man&sort=best-sellers' },
          { label: 'Member Exclusive', href: '/allproducts?category=man&sort=member' },
        ],
      }
    ]
  },
  {
    id: 'woman',
    label: 'Women',
    columns: [
      {
        title: 'Clothing',
        links: [
          { label: 'All Clothing', href: '/allproducts?category=woman&subcategory=clothing' },
          { label: 'T-Shirts & Tops', href: '/allproducts?category=woman&subcategory=t-shirts' },
          { label: 'Hoodies & Sweatshirts', href: '/allproducts?category=woman&subcategory=hoodies' },
          { label: 'Jackets & Vests', href: '/allproducts?category=woman&subcategory=jackets' },
          { label: 'Pants & Tights', href: '/allproducts?category=woman&subcategory=pants' },
          { label: 'Sports Bras', href: '/allproducts?category=woman&subcategory=sports-bras' },
        ],
      },
      {
        title: 'Featured',
        links: [
          { label: 'New Releases', href: '/allproducts?category=woman&sort=new' },
          { label: 'Best Sellers', href: '/allproducts?category=woman&sort=best-sellers' },
          { label: 'Member Exclusive', href: '/allproducts?category=woman&sort=member' },
        ],
      }
    ]
  },
  {
    id: 'shoes',
    label: 'Shoes',
    columns: [
      {
        title: 'By Activity',
        links: [
          { label: 'All Shoes', href: '/allproducts?category=shoes' },
          { label: 'Running', href: '/allproducts?category=shoes&subcategory=running' },
          { label: 'Basketball', href: '/allproducts?category=shoes&subcategory=basketball' },
          { label: 'Football', href: '/allproducts?category=shoes&subcategory=football' },
          { label: 'Training & Gym', href: '/allproducts?category=shoes&subcategory=training' },
          { label: 'Lifestyle', href: '/allproducts?category=shoes&subcategory=lifestyle' },
        ],
      }
    ]
  },
  {
    id: 'accessories',
    label: 'Accessories',
    columns: [
      {
        title: 'All Accessories',
        links: [
          { label: 'Bags & Backpacks', href: '/allproducts?category=accessories&subcategory=bags' },
          { label: 'Socks', href: '/allproducts?category=accessories&subcategory=socks' },
          { label: 'Hats & Headwear', href: '/allproducts?category=accessories&subcategory=hats' },
          { label: 'Water Bottles', href: '/allproducts?category=accessories&subcategory=water-bottles' },
        ],
      }
    ]
  },
  {
    id: 'equipment',
    label: 'Equipment',
    columns: [
      {
        title: 'Sports Equipment',
        links: [
          { label: 'Balls', href: '/allproducts?category=equipment&subcategory=balls' },
          { label: 'Yoga Mats', href: '/allproducts?category=equipment&subcategory=yoga-mats' },
          { label: 'Resistance Bands', href: '/allproducts?category=equipment&subcategory=bands' },
          { label: 'Weights', href: '/allproducts?category=equipment&subcategory=weights' },
        ],
      }
    ]
  }
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileCategory, setActiveMobileCategory] = useState(null);
  
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeout = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const context = useContext(myContext);
  const { searchkey, setSearchkey, setFilterType, setFilterPrice, setFilterSize, setFilterColor, product } = context;

  const cartItems = useSelector((state) => state.cart) || [];
  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(user?.user?.uid);

  const searchProducts = (product || []).filter((item) => {
    const searchStr = (searchkey || '').toLowerCase();
    if (!searchStr) return false;
    return (
      (item.title || '').toLowerCase().includes(searchStr) ||
      (item.category || '').toLowerCase().includes(searchStr) ||
      (item.colors || []).some((color) => (color || '').toLowerCase().includes(searchStr))
    );
  }).slice(0, 5);

  const handleSearchClick = (item) => {
    setIsSearchOpen(false);
    navigate(`/productinfo/${item.id}`);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setIsProfileMenuOpen((prev) => !prev);
      return;
    }
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsProfileMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleMouseEnter = (id) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150); // Small debounce to prevent flickering
  };

  const toggleMobileCategory = (id) => {
    setActiveMobileCategory(prev => (prev === id ? null : id));
  };
  
  const handleLinkClick = (href) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    // Clear all filters when navigating
    setSearchkey('');
    setFilterType('');
    if (setFilterPrice) setFilterPrice('');
    if (setFilterSize) setFilterSize([]);
    if (setFilterColor) setFilterColor([]);
    navigate(href);
  };

  return (
    <>
    <header className="w-full bg-white z-50 sticky top-0 font-sans" onMouseLeave={handleMouseLeave}>
      <div className="h-[60px] flex items-center justify-between px-6 lg:px-10 border-b border-[#E5E5E5] bg-white relative z-50">
        <Link to="/" className="flex-shrink-0 hover:opacity-70 transition-opacity" onClick={() => handleLinkClick('/')}>
          <img src="/logo.png" alt="Nexor Fit Logo" className="h-10 w-auto object-contain" />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-7 font-bold text-[15px] tracking-wide text-[#111111] h-full">
          <button onClick={() => handleLinkClick('/allproducts?sale=true')} className="flex items-center gap-1.5 text-red-600 hover:border-b-2 border-red-600 pb-1 bg-transparent transform transition-transform hover:scale-105"><FiTag className="text-lg animate-pulse" /> Sale</button>
          
          {MEGA_MENU_DATA.map((category) => (
            <div 
              key={category.id}
              className="h-full flex items-center cursor-pointer"
              onMouseEnter={() => handleMouseEnter(category.id)}
            >
              <button 
                className={`hover:border-b-2 pb-1 bg-transparent transition-all ${activeDropdown === category.id ? 'border-black' : 'border-transparent'}`}
                onClick={() => handleLinkClick(`/allproducts?category=${category.id}`)}
              >
                {category.label}
              </button>
            </div>
          ))}
        </nav>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
            {activeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[60px] left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50 pointer-events-auto"
                onMouseEnter={() => handleMouseEnter(activeDropdown)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="max-w-[1920px] mx-auto px-10 py-10 flex gap-20 justify-center">
                  {MEGA_MENU_DATA.find(c => c.id === activeDropdown)?.columns.map((column, idx) => (
                    <div key={idx} className="flex flex-col gap-4">
                      <h3 className="font-bold text-[#111111]">{column.title}</h3>
                      <div className="flex flex-col gap-2">
                        {column.links.map((link, linkIdx) => (
                          <button 
                            key={linkIdx} 
                            onClick={() => handleLinkClick(link.href)}
                            className="text-left text-gray-500 hover:text-[#111111] transition-colors text-sm"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        <div className="flex items-center justify-end gap-3 lg:gap-5 w-[140px] lg:w-[240px]">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-yellow-100 transition-colors" onClick={() => setIsSearchOpen(true)}>
            <FiSearch className="text-2xl text-[#111111]" />
          </button>

          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-100 transition-colors" onClick={() => navigate('/wishlist')}>
            <FiHeart className="text-2xl text-[#111111]" />
          </button>

          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-blue-100 transition-colors relative" onClick={() => navigate('/cart')}>
            <FiShoppingBag className="text-2xl text-[#111111]" />
            {cartItemCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#111111] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-purple-100 transition-colors relative"
              onClick={handleProfileClick}
              title={isLoggedIn ? 'Account' : 'Sign In'}
            >
              <FiUser className="text-2xl text-[#111111]" />
              {isLoggedIn && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-[#111111] rounded-full border-2 border-white"></span>}
            </button>

            {isLoggedIn && isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-100 overflow-hidden bg-gradient-to-r from-purple-50 to-pink-50">
                    <p className="text-[#111111] font-medium text-sm truncate" title={user?.user?.email}>{user?.user?.email || 'My Account'}</p>
                </div>
                <div className="p-3 space-y-2">
                  <Link to="/order" className="block px-4 py-2 text-[#111111] text-sm hover:bg-yellow-100 rounded transition-colors font-medium" onClick={() => setIsProfileMenuOpen(false)}>My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-[#111111] text-sm hover:bg-red-100 rounded transition-colors font-medium" onClick={() => setIsProfileMenuOpen(false)}>Wishlist</Link>
                  {user?.profile?.role === 'admin' ? (
                    <Link to="/dashboard" className="block px-4 py-2 text-[#111111] text-sm hover:bg-green-100 rounded transition-colors font-bold" onClick={() => setIsProfileMenuOpen(false)}>Admin Dashboard</Link>
                  ) : null}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[#111111] text-sm hover:bg-red-200 rounded transition-colors flex items-center gap-2 font-medium">
                    <FiLogOut className="text-sm" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="lg:hidden text-[#111111] hover:opacity-60 transition-opacity ml-2" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
            {isMobileMenuOpen ? <FiX className="text-3xl" /> : <FiMenu className="text-3xl" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-white z-40 p-6 flex flex-col gap-6 overflow-y-auto">
          <button className="flex items-center gap-2 text-2xl font-bold text-red-600 text-left transform transition-transform hover:translate-x-2" onClick={() => handleLinkClick('/allproducts?sale=true')}><FiTag className="text-2xl animate-pulse" /> Sale</button>
          
          {/* Mobile Accordion Menu */}
          {MEGA_MENU_DATA.map((category) => (
            <div key={category.id} className="flex flex-col border-b border-gray-100 pb-2">
              <button 
                className="flex items-center justify-between text-2xl font-bold text-[#111111] text-left w-full py-2"
                onClick={() => toggleMobileCategory(category.id)}
              >
                {category.label}
                <FiChevronDown className={`transition-transform duration-300 ${activeMobileCategory === category.id ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeMobileCategory === category.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden flex flex-col gap-4 mt-2"
                  >
                    <button 
                      className="text-left font-bold text-gray-700 py-1 pl-4"
                      onClick={() => handleLinkClick(`/allproducts?category=${category.id}`)}
                    >
                      All {category.label}
                    </button>
                    {category.columns.map((col, idx) => (
                      <div key={idx} className="flex flex-col gap-2 pl-4">
                        <span className="font-semibold text-sm text-gray-400 mt-2">{col.title}</span>
                        {col.links.map((link, lIdx) => (
                          <button 
                            key={lIdx}
                            className="text-left text-[#111111] py-1 text-lg"
                            onClick={() => handleLinkClick(link.href)}
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="mt-8 flex flex-col gap-4 text-lg font-medium text-gray-500">
            <Link to="/order" onClick={() => setIsMobileMenuOpen(false)}>My Orders</Link>
            {user?.profile?.role === 'admin' ? (
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-[#111111] font-bold">Admin Dashboard</Link>
            ) : null}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left flex items-center gap-2"
              >
                <FiLogOut className="text-sm" />
                Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center pt-24 px-4">
          <div className="relative w-full max-w-2xl flex items-center bg-white border border-gray-300 rounded-full shadow-lg px-4 py-3">
            <FiSearch className="text-2xl text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search products..."
              autoFocus
              value={searchkey || ''}
              onChange={(e) => setSearchkey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsSearchOpen(false);
                  navigate('/allproducts');
                }
              }}
              className="w-full bg-transparent border-none outline-none text-xl font-medium text-[#111111] placeholder-gray-400"
            />
            <button onClick={() => setIsSearchOpen(false)} className="text-gray-500 hover:text-black">
              <FiX className="text-2xl" />
            </button>
          </div>

          {searchkey && (
            <div className="w-full max-w-2xl mt-6 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
              {searchProducts.length > 0 ? (
                <>
                  {searchProducts.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSearchClick(item)}
                      className="flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-yellow-50 border-b border-gray-50 last:border-none"
                    >
                      <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-black">{item.title}</span>
                        <span className="text-sm text-gray-500">{item.category}</span>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="p-4 bg-blue-50 text-center font-semibold text-[#111111] hover:bg-blue-100 cursor-pointer border-t border-gray-200 transition-colors"
                    onClick={() => {
                        setIsSearchOpen(false);
                        navigate('/allproducts');
                    }}
                  >
                    See all results for "{searchkey}"
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500 text-lg">No exact matches found</div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
    
    {/* Dark Overlay for Mega Menu */}
    <AnimatePresence>
      {activeDropdown && !isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="hidden lg:block fixed inset-0 top-[60px] bg-black/40 backdrop-blur-sm z-30 pointer-events-none"
        />
      )}
    </AnimatePresence>
    </>
  );
}

export default Header;
