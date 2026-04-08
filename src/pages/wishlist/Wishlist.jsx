import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa';

function Wishlist() {
  const context = useContext(myContext);
  const { mode, wishlist, getWishlistData, removeFromWishlistBackend, loading } = context;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const userId = user?.user?.uid;

  // Load wishlist on component mount
  useEffect(() => {
    if (userId) {
      getWishlistData(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const removeFromWishlistHandler = (wishlistItemId) => {
    if (userId) {
      removeFromWishlistBackend(wishlistItemId, userId);
    }
  };

  const addToCartHandler = (item) => {
    dispatch(addToCart(item.product));
    toast.success('Added to cart! 🛒');
  };

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      </Layout>
    );
  }

  // Show login prompt if not logged in
  if (!userId) {
    return (
      <Layout>
        <div className="min-h-screen py-20 px-4">
          <div className="max-w-md mx-auto text-center">
            <FaHeart className="text-7xl text-black dark:text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
              Please Login
            </h2>
            <p className="text-lg mb-6" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
              Login to view your wishlist and save your favorite products
            </p>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-full font-bold transition-all bg-black text-white dark:bg-white dark:text-black duration-300 transform hover:scale-105 hover:shadow-xl"
              >
              Login Now
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-10 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaHeart className="text-4xl text-black dark:text-white" />
              <h1 
                className="text-4xl md:text-5xl font-bold text-black dark:text-white">
                My Wishlist
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-20 bg-black dark:bg-white rounded-full"></div>
              <div className="h-1 w-10 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              <div className="h-1 w-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <p className="text-lg mt-2" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative rounded-2xl overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-fade-in"
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white',
                    borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb',
                    animationDelay: `${index * 0.1}s`
                  }}>
                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromWishlistHandler(item.id)}
                      className="absolute top-4 right-4 z-10 p-3 bg-white rounded-full shadow-lg transition-all duration-300 hover:bg-black hover:text-white hover:scale-110"
                      style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white' }}>
                      <FaTrash />
                    </button>
  
                    {/* Image */}
                    <div 
                      className="relative cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-800"
                      onClick={() => navigate(`/productinfo/${item.product.id}`)}>
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Wishlist Badge */}
                      <div className="absolute top-4 left-4 bg-black dark:bg-white dark:text-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        Saved
                      </div>
                    </div>
  
                    {/* Content */}
                    <div className="p-5">
                      <h2
                        className="text-xs tracking-widest mb-2 font-medium"
                        style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                        {item.product.category}
                      </h2>
                      <h1
                        className="text-lg font-bold mb-2 line-clamp-2 transition-colors duration-300"
                        style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                        {item.product.title}
                      </h1>
  
                      {/* Price and Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xl font-bold">
                          ₹{item.product.price}
                        </p>
                        <div className="flex items-center gap-1 text-black dark:text-white">
                          <FaStar />
                          <span className="text-sm font-semibold">
                            4.5
                          </span>
                        </div>
                      </div>
  
                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCartHandler(item)}
                        className="w-full py-3 rounded-full font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center gap-2"
                        >
                        <FaShoppingCart />
                        Add To Cart
                      </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="flex flex-col items-center gap-6">
                <div className="p-8 rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                  <FaHeart className="text-7xl text-black dark:text-white" />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                  Your Wishlist is Empty
                </h2>
                <p className="text-lg" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  Start adding products you love to your wishlist!
                </p>
                <button
                  onClick={() => navigate('/allproducts')}
                  className="shadow-lg hover:shadow-2xl px-8 py-4 rounded-full font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  style={{
                    backgroundColor: mode === 'dark' ? 'white' : 'black',
                    color: mode === 'dark' ? 'black' : 'white',
                  }}
                  >
                  <FaShoppingCart />
                  Start Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Wishlist;
