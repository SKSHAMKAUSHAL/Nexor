import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingBag, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import myContext from '../../context/data/myContext';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();
  const context = useContext(myContext);
  const { searchkey, setSearchkey, setFilterType, product } = context;

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

  const setGenderFilter = (gender) => {
    setSearchkey('');
    setFilterType(gender);
    navigate('/allproducts');
  };

  return (
    <header className="w-full bg-white z-50 sticky top-0 font-sans">
      <div className="h-[60px] flex items-center justify-between px-6 lg:px-10 border-b border-[#E5E5E5] bg-white">
        <Link to="/" className="flex-shrink-0 hover:opacity-70 transition-opacity">
          <img src="/logo.png" alt="ShopUp Logo" className="h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-bold text-[15px] tracking-wide text-[#111111]">
          <button onClick={() => setGenderFilter('man')} className="hover:border-b-2 border-black pb-1 bg-transparent">Men</button>
          <button onClick={() => setGenderFilter('women')} className="hover:border-b-2 border-black pb-1 bg-transparent">Women</button>
          <button onClick={() => setGenderFilter('child')} className="hover:border-b-2 border-black pb-1 bg-transparent">Kids</button>
        </nav>

        <div className="flex items-center justify-end gap-3 lg:gap-5 w-[140px] lg:w-[240px]">
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors" onClick={() => setIsSearchOpen(true)}>
            <FiSearch className="text-2xl text-[#111111]" />
          </button>

          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors" onClick={() => navigate('/wishlist')}>
            <FiHeart className="text-2xl text-[#111111]" />
          </button>

          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors" onClick={() => navigate('/cart')}>
            <FiShoppingBag className="text-2xl text-[#111111]" />
          </button>

          <div className="relative">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors relative"
              onClick={handleProfileClick}
              title={isLoggedIn ? 'Account' : 'Sign In'}
            >
              <FiUser className="text-2xl text-[#111111]" />
              {isLoggedIn && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-[#111111] rounded-full border-2 border-white"></span>}
            </button>

            {isLoggedIn && isProfileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="text-[#111111] font-medium text-sm">{user?.user?.email || 'My Account'}</p>
                </div>
                <div className="p-3 space-y-2">
                  <Link to="/order" className="block px-4 py-2 text-[#111111] text-sm hover:bg-[#F5F5F5] rounded transition-colors" onClick={() => setIsProfileMenuOpen(false)}>My Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-[#111111] text-sm hover:bg-[#F5F5F5] rounded transition-colors" onClick={() => setIsProfileMenuOpen(false)}>Wishlist</Link>
                  {user?.profile?.role === 'admin' ? (
                    <Link to="/dashboard" className="block px-4 py-2 text-[#111111] text-sm hover:bg-[#F5F5F5] font-bold rounded transition-colors" onClick={() => setIsProfileMenuOpen(false)}>Admin Dashboard</Link>
                  ) : null}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-[#111111] text-sm hover:bg-[#F5F5F5] rounded transition-colors flex items-center gap-2">
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
          <button className="text-2xl font-bold text-[#111111] text-left" onClick={() => { setGenderFilter('man'); setIsMobileMenuOpen(false); }}>Men</button>
          <button className="text-2xl font-bold text-[#111111] text-left" onClick={() => { setGenderFilter('women'); setIsMobileMenuOpen(false); }}>Women</button>
          <button className="text-2xl font-bold text-[#111111] text-left" onClick={() => { setGenderFilter('child'); setIsMobileMenuOpen(false); }}>Kids</button>

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
                searchProducts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSearchClick(item)}
                    className="flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b border-gray-50 last:border-none"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-black">{item.title}</span>
                      <span className="text-sm text-gray-500">{item.category}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-lg">No exact matches found</div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
