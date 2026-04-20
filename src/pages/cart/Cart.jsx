import { useContext, useState, useMemo } from 'react';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Modal from '../../components/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFromCart,
  increMantQuantity,
  decreMantQuantity,
  clearCart
} from '../../redux/cartSlice';
import { toast } from 'react-toastify';
import { addDoc, collection } from 'firebase/firestore';
import { fireDB } from '../../firebase/FirebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import { processPayment } from '../../utils/razorpay';

function Cart() {
  const { mode } = useContext(myContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let cartItems = useSelector((state) => state.cart) || [];

  // Filter valid items
  const validCartItems = cartItems.filter(
    (item) => item && item.id && item.title && item.price !== undefined
  );

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // ✅ Quantity handlers
  const handleDelete = (item) => {
    dispatch(deleteFromCart(item));
    toast.success('Removed from cart');
  };

  const handleIncrease = (item) => {
    dispatch(increMantQuantity(item));
  };

  const handleDecrease = (item) => {
    dispatch(decreMantQuantity(item));
  };

  // ✅ Calculations
  const { totalAmount, totalItems } = useMemo(() => {
    const items = validCartItems.reduce(
      (acc, item) => acc + (item.quantity || 1),
      0
    );

    const amount = validCartItems.reduce(
      (acc, item) =>
        acc + Number(item.price) * (item.quantity || 1),
      0
    );

    return { totalAmount: amount, totalItems: items };
  }, [validCartItems]);

  const shipping = totalAmount > 500 ? 0 : 100;
  const discount = totalAmount > 1000 ? totalAmount * 0.1 : 0;
  const grandTotal = totalAmount + shipping - discount;

  // ✅ Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Buy Now
  const buyNow = async () => {
    if (!user) {
      toast.error('Please login');
      navigate('/login');
      return;
    }

    if (validCartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // ✅ Validation
    if (!name || !address || !pincode || !phoneNumber) {
      return toast.error('All fields required');
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      return toast.error('Invalid phone number');
    }

    if (!/^\d{6}$/.test(pincode)) {
      return toast.error('Invalid pincode');
    }

    setLoading(true);

    const orderInfo = {
      cartItems: validCartItems,
      addressInfo: { name, address, pincode, phoneNumber },
      email: user?.user?.email || 'guest',
      userid: user?.user?.uid || 'guest',
      date: new Date().toLocaleString()
    };

    // ✅ Execute external payment processor
    await processPayment({
      grandTotal,
      orderInfo,
      user,
      name,
      phoneNumber,
      dispatch,
      clearCart,
      toast,
      navigate,
      setLoading
    });
  };

  // ✅ Empty cart UI
  if (validCartItems.length === 0) {
    return (
      <Layout>
        <div
          className="min-h-screen flex flex-col items-center justify-center"
          style={{
            backgroundColor: mode === 'dark' ? '#282c34' : '#f9fafb',
            color: mode === 'dark' ? 'white' : 'black',
          }}
        >
          <div className="text-center">
            <div className="mb-8">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link to="/allproducts">
              <button 
                className="font-bold uppercase tracking-widest py-4 px-10 rounded-full transition-all border-2 border-black bg-black text-white hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
              >
                Start Shopping
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div
        className="min-h-screen bg-gray-50 pt-8 pb-10"
        style={{
          backgroundColor: mode === 'dark' ? '#282c34' : '',
          color: mode === 'dark' ? 'white' : '',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#111111] dark:text-white">Shopping Cart</h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1 font-medium">{totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart</p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your cart?')) {
                  dispatch(clearCart());
                  toast.info('Cart cleared');
                }
              }}
              className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors self-start sm:self-auto border-b-2 border-transparent hover:border-black dark:hover:border-white pb-1"
            >
              Clear Cart
            </button>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-x-12 gap-y-8">
            {/* Left - Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8">
              <div className="space-y-6">
                {validCartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-6 border-b pb-6"
                    style={{ borderColor: mode === 'dark' ? '#374151' : '#e5e7eb' }}
                  >
                    {/* Image */}
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden h-32 w-32 sm:h-40 sm:w-40 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover mix-blend-multiply"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-tight pr-4">{item.title}</h2>
                          <p className="text-lg font-bold">₹{parseInt(item.price) * (item.quantity || 1)}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 capitalize font-medium">{item.category}</p>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between mt-4 sm:mt-0">
                        <div className="flex items-center border-2 rounded-full px-2 py-1" style={{ borderColor: mode === 'dark' ? '#4b5563' : '#000' }}>
                          <button
                            onClick={() => handleDecrease(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-lg outline-none"
                          >
                            −
                          </button>
                          <span className="w-12 text-center font-bold text-lg select-none">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-bold text-lg outline-none"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleDelete(item)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link to="/allproducts">
                <button className="mt-8 mb-4 w-full sm:w-auto flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm border-2 border-black dark:border-white px-8 py-4 rounded-full transition-all hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                  </svg>
                  Continue Shopping
                </button>
              </Link>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
              <div
                className="p-6 sm:p-8 rounded-2xl lg:sticky lg:top-24"
                style={{
                  backgroundColor: mode === 'dark' ? '#202123' : '#ffffff',
                  color: mode === 'dark' ? 'white' : 'black',
                  boxShadow: mode === 'dark' ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <h2 className="text-2xl font-black uppercase tracking-wide mb-6">Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-500">Estimated Delivery</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-gray-500">Discount (10%)</span>
                      <span className="text-green-600">-₹{discount}</span>
                    </div>
                  )}
                  
                  {/* Delivery Promos */}
                  {totalAmount < 500 && (
                    <div className="border-l-4 border-black dark:border-white bg-gray-100 dark:bg-gray-800 p-4 mt-6 rounded-r-lg">
                      <p className="text-sm font-bold text-black dark:text-white tracking-wide">
                        Add ₹{500 - totalAmount} more to get FREE shipping! 🚚
                      </p>
                    </div>
                  )}

                  {totalAmount >= 500 && totalAmount < 1000 && (
                    <div className="border-l-4 border-black dark:border-white bg-gray-100 dark:bg-gray-800 p-4 mt-6 rounded-r-lg">
                      <p className="text-sm font-bold text-black dark:text-white tracking-wide">
                        Add ₹{1000 - totalAmount} more to get 10% discount! 🎉
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-b-2 py-4 mb-8" style={{ borderColor: mode === 'dark' ? '#374151' : '#e5e7eb' }}>
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold uppercase tracking-wider">Total</span>
                    <span className="font-black">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Checkout Buttons */}
                {user ? (
                  <Modal
                    name={name}
                    address={address}
                    pincode={pincode}
                    phoneNumber={phoneNumber}
                    setName={setName}
                    setAddress={setAddress}
                    setPincode={setPincode}
                    setPhoneNumber={setPhoneNumber}
                    buyNow={buyNow}
                    loading={loading}
                  />
                ) : (
                  <button
                    onClick={() => {
                      toast.error('Please login to checkout', { position: 'top-center' });
                      navigate('/login');
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-black text-white border-2 border-black py-4 rounded-full text-xl font-black uppercase tracking-widest transition-all animate-pulse hover:animate-none hover:bg-white hover:text-black hover:shadow-xl active:scale-95"
                  >
                    Guest Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart; 
