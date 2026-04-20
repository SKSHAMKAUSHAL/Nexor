import { useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../context/data/myContext';
import Layout from '../../components/layout/Layout';
import Loader from '../../components/loader/Loader';
import { 
  FaBox, 
  FaShippingFast, 
  FaCheckCircle, 
  FaCalendarAlt, 
  FaCreditCard, 
  FaUser, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaSearch,
  FaChevronDown,
  FaTruck
} from 'react-icons/fa';

function Order() {
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    storedUser = null;
  }

  const userid = storedUser?.user?.uid || null;
  const navigate = useNavigate();
  const context = useContext(myContext);
  const { mode, loading, order, getOrderData } = context;

  useEffect(() => {
    if (!userid) {
      navigate('/login');
    } else {
      getOrderData();
    }
  }, [userid, navigate]);

  // State manageMant
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const Orders = useMemo(() => (
    userid ? order.filter((obj) => obj.userid === userid) : []
  ), [order, userid]);

  // Toggle order expansion
  const toggleOrder = (index) => {
    if (expandedOrders.includes(index)) {
      setExpandedOrders(expandedOrders.filter(i => i !== index));
    } else {
      setExpandedOrders([...expandedOrders, index]);
    }
  };

  // Calculate order total
  const calculateOrderTotal = (cartItems) => {
    return cartItems.reduce((total, item) => total + (Number(item.price) * (item.quantity || 1)), 0);
  };

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = [...Orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        (order.paymentId || order.payMantId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.addressInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => calculateOrderTotal(b.cartItems) - calculateOrderTotal(a.cartItems));
    }

    return filtered;
  }, [Orders, searchTerm, sortBy]);

  // Order status (you can enhance this based on your actual status logic)
  const getOrderStatus = (order) => {
    // This is a placeholder - customize based on your business logic
    return order.status || 'Processing';
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return 'bg-green-600';
      case 'shipped': return 'bg-gray-600';
      case 'processing': return 'bg-gray-400';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-black dark:bg-white';
    }
  };

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered': return <FaCheckCircle />;
      case 'shipped': return <FaTruck />;
      case 'processing': return <FaBox />;
      default: return <FaShippingFast />;
    }
  };

  return (
    <Layout>
      {loading && <Loader />}
      
      <div className="min-h-screen py-10 px-4 md:px-10 mb-20">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-3">
              <FaBox className="text-4xl text-[#111111] dark:text-white" />
              <h1 
                className="text-4xl md:text-5xl font-bold text-[#111111] dark:text-white"
              >
                My Orders
              </h1>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-20 bg-black dark:bg-white rounded-full"></div>
              <div className="h-1 w-10 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              <div className="h-1 w-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <p className="text-gray-500 mt-2" style={{ color: mode === 'dark' ? '#9ca3af' : '' }}>
              Track and manage your orders
            </p>
          </div>

          {Orders.length > 0 ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in">
                <div 
                  className="p-6 rounded-2xl border-2 transition-colors duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white',
                    borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-black dark:bg-white text-white dark:text-black">
                      <FaBox className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm tracking-wider uppercase" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Total Orders</p>
                      <p className="text-3xl font-bold" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                        {Orders.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white',
                    borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-black dark:bg-white text-white dark:text-black">
                      <FaCreditCard className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm tracking-wider uppercase" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Total Spent</p>
                      <p className="text-3xl font-bold" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                        ₹{Orders.reduce((total, order) => total + calculateOrderTotal(order.cartItems), 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:scale-105"
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white',
                    borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-black dark:bg-white text-white dark:text-black">
                      <FaShippingFast className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm tracking-wider uppercase" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Items Ordered</p>
                      <p className="text-3xl font-bold" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                        {Orders.reduce((total, order) => total + order.cartItems.length, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="mb-6 flex flex-col md:flex-row gap-4 animate-fade-in">
                {/* Search */}
                <div className="flex-1 relative">
                  <FaSearch 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2" 
                    style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}
                  />
                    <input
                    type="text"
                    placeholder="Search by Order ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 font-medium transition-all duration-300 focus:outline-none focus:border-black dark:focus:border-white"
                    style={{
                      backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white',
                      color: mode === 'dark' ? 'white' : '#1f2937',
                      borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb'
                    }}
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 rounded-full border-2 font-medium cursor-pointer transition-all duration-300 hover:border-gray-800 dark:hover:border-gray-300 focus:outline-none focus:border-black dark:focus:border-white"
                  style={{
                    backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white',
                    color: mode === 'dark' ? 'white' : '#1f2937',
                    borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb'
                  }}
                >
                  <option value="newest">📅 Newest First</option>
                  <option value="oldest">📅 Oldest First</option>
                  <option value="amount">💰 Highest Amount</option>
                </select>
              </div>

              {/* Orders List */}
              <div className="space-y-6">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => {
                    const isExpanded = expandedOrders.includes(index);
                    const orderStatus = getOrderStatus(order);
                    const orderTotal = calculateOrderTotal(order.cartItems);

                    return (
                      <div 
                        key={index} 
                        className="border-2 rounded-2xl overflow-hidden transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500 animate-fade-in"
                        style={{ 
                          backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : 'white',
                          borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb',
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        {/* Order Header - Always Visible */}
                        <div 
                          className="p-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                          onClick={() => toggleOrder(index)}
                          >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Order Info */}
                            <div className="flex items-center gap-4">
                              <div className="p-4 rounded-xl bg-gray-200 dark:bg-gray-700">
                                <FaBox className="text-2xl text-black dark:text-white" />
                              </div>
                              <div>
                                <h2 className="text-xl font-bold mb-1" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                  Order #{index + 1}
                                </h2>
                                <div className="flex items-center gap-2 text-sm" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                  <FaCalendarAlt />
                                  <span>{order.date}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status and Amount */}
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm tracking-wider uppercase mb-1" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                  Order Total
                                </p>
                                <p className="text-2xl font-bold">
                                  ₹{orderTotal.toLocaleString('en-IN')}
                                </p>
                              </div>

                              <div className={`px-4 py-2 flex items-center gap-2 rounded-full font-bold uppercase tracking-wider text-sm
                                ${orderStatus.toLowerCase() === 'processing' ? 'bg-black text-white dark:bg-white dark:text-black' : getStatusColor(orderStatus)}`}
                              >
                                {getStatusIcon(orderStatus)}
                                {orderStatus}
                              </div>

                              {/* Expand Icon */}
                              <div className="p-2 rounded-full transition-transform duration-300"
                                style={{ 
                                  backgroundColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb',
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                              >
                                <FaChevronDown style={{ color: mode === 'dark' ? 'white' : '#1f2937' }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        <div 
                          className={`transition-all duration-500 overflow-hidden ${
                            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="p-6 border-t-2" style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb' }}>
                            {/* PayMent ID */}
                            <div className="mb-6 p-4 rounded-xl border-2 border-dashed flex justify-between items-center"
                              style={{ 
                                backgroundColor: mode === 'dark' ? 'rgb(31 41 55)' : '#f9fafb',
                                borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#d1d5db'
                              }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <FaCreditCard className="text-black dark:text-white" />
                                <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                  Payment ID
                                </span>
                              </div>
                              <p className="text-lg font-mono font-medium" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                {order.paymentId || order.payMantId || 'N/A'}
                              </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              {/* Shipping Info */}
                              <div className="p-5 rounded-xl border-2"
                                style={{ 
                                  backgroundColor: mode === 'dark' ? 'rgb(31 41 55)' : '#f9fafb',
                                  borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb'
                                }}
                              >
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 tracking-wider uppercase border-b-2 pb-2"
                                  style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}
                                >
                                  <FaShippingFast className="text-black dark:text-white" />
                                  Shipping Details
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex items-start gap-2">
                                    <FaUser className="mt-1 text-black dark:text-white" />
                                    <div>
                                      <p className="text-xs uppercase tracking-widest font-medium" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Name</p>
                                      <p className="font-semibold text-lg" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                        {order.addressInfo.name}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <FaMapMarkerAlt className="mt-1 text-black dark:text-white" />
                                    <div>
                                      <p className="text-xs uppercase tracking-widest font-medium" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Address</p>
                                      <p className="font-semibold text-lg" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                        {order.addressInfo.address}, {order.addressInfo.pincode}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <FaPhone className="mt-1 text-black dark:text-white" />
                                    <div>
                                      <p className="text-xs uppercase tracking-widest font-medium" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Phone</p>
                                      <p className="font-semibold text-lg" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                        {order.addressInfo.phoneNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <FaEnvelope className="mt-1 text-black dark:text-white" />
                                    <div>
                                      <p className="text-xs uppercase tracking-widest font-medium" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Email</p>
                                      <p className="font-semibold text-lg" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                        {order.email}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div className="p-5 rounded-xl border-2"
                                style={{ 
                                  backgroundColor: mode === 'dark' ? 'rgb(31 41 55)' : '#f9fafb',
                                  borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb'
                                }}
                              >
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider border-b-2 pb-2"
                                  style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}
                                >
                                  <FaCreditCard className="text-black dark:text-white" />
                                  Order Summary
                                </h3>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="font-medium tracking-wide uppercase text-sm" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Items ({order.cartItems.length})</span>
                                    <span className="font-semibold text-lg" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                      ₹{orderTotal.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="font-medium tracking-wide uppercase text-sm" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>Shipping</span>
                                    <span className="font-bold uppercase tracking-wider text-black dark:text-white">FREE</span>
                                  </div>
                                  <div className="pt-3 border-t-2" style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb' }}>
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold uppercase tracking-widest text-lg" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>Total</span>
                                      <span className="font-bold text-2xl text-black dark:text-white">
                                        ₹{orderTotal.toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Items List */}
                            <div>
                              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider"
                                style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}
                              >
                                <FaBox className="text-black dark:text-white" />
                                Order Items ({order.cartItems.length})
                              </h3>
                              <div className="space-y-4">
                                {order.cartItems.map((item, i) => (
                                  <div 
                                    key={i} 
                                    className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl border-2 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    style={{ 
                                      backgroundColor: mode === 'dark' ? 'rgb(31 41 55)' : 'white',
                                      borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#f3f4f6'
                                    }}
                                  >
                                    <img 
                                      src={item.imageUrl} 
                                      alt={item.title} 
                                      className="w-24 h-24 object-cover rounded-lg border-2"
                                      style={{ borderColor: mode === 'dark' ? 'rgb(75 85 99)' : '#e5e7eb' }}
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-bold text-lg mb-1" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                                        {item.title}
                                      </h4>
                                      {item.selectedVariation && (
                                        <p className="text-sm font-medium tracking-wide uppercase mb-2 mt-1" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                          {item.selectedVariation}
                                        </p>
                                      )}
                                      <p className="text-sm mb-2 line-clamp-2" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                                        {item.description}
                                      </p>
                                      <div className="flex items-center gap-4">
                                        <p className="text-xl font-bold text-black dark:text-white">
                                          ₹{Number(item.price).toLocaleString('en-IN')}
                                        </p>
                                        {item.quantity > 1 && (
                                          <span className="px-3 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-semibold tracking-wider uppercase">
                                            Qty: {item.quantity}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <FaSearch className="text-6xl" style={{ color: mode === 'dark' ? '#9ca3af' : '#d1d5db' }} />
                      <h2 className="text-2xl font-bold" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                        No Orders Found
                      </h2>
                      <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="flex flex-col items-center gap-6">
                <div className="p-8 rounded-full bg-gray-100 dark:bg-gray-800">
                  <FaBox className="text-7xl text-black dark:text-white" />
                </div>
                <h2 className="text-3xl font-bold" style={{ color: mode === 'dark' ? 'white' : '#1f2937' }}>
                  No Orders Yet
                </h2>
                <p className="text-lg" style={{ color: mode === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  Start shopping to see your orders here!
                </p>
                <button
                  onClick={() => navigate('/allproducts')}
                  className="shadow-md px-8 py-4 rounded-full font-bold transition-colors duration-200 hover:bg-gray-800 dark:hover:bg-gray-200 flex gap-2 items-center"
                  style={{
                    backgroundColor: mode === 'dark' ? 'white' : 'black',
                    color: mode === 'dark' ? 'black' : 'white',
                  }}
                >
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

export default Order;
