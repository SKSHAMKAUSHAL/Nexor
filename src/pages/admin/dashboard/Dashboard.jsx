import { useContext, useMemo, useEffect } from 'react';
import { FaUserTie, FaShoppingBag, FaBoxOpen } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import myContext from '../../../context/data/myContext';
import Layout from '../../../components/layout/Layout';
import DashboardTab from './DashboardTab';

function Dashboard() {
  const context = useContext(myContext);
  const { mode, product, order, user, getOrderData, getUserData } = context;

  // Always fetch latest data when admin visits dashboard
  useEffect(() => {
    getOrderData();
    getUserData();
  }, []);

  // Calculate total revenue with useMemo for optimization
  const totalRevenue = useMemo(() => {
    return order.reduce((total, orderItem) => {
      const orderTotal = orderItem.cartItems.reduce((sum, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemQuantity = Number(item.quantity) || 1;
        return sum + (itemPrice * itemQuantity);
      }, 0);
      return total + orderTotal;
    }, 0);
  }, [order]);

  const totalItemsSold = useMemo(() => {
    return order.reduce((total, orderItem) => {
      const orderItemCount = orderItem.cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      return total + orderItemCount;
    }, 0);
  }, [order]);

  const cards = [
    { title: 'Total Products', value: product.length, icon: <FaBoxOpen size={32} />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' },
    { title: 'Total Orders', value: order.length, icon: <FaShoppingBag size={32} />, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' },
    { title: 'Total Users', value: user.length, icon: <FaUserTie size={32} />, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400' },
    { title: 'Total Revenue', value: '₹' + totalRevenue.toLocaleString('en-IN'), icon: <MdAttachMoney size={32} />, subtitle: totalItemsSold + ' items sold', color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400' }, 
  ];

  return (
    <Layout>
      <section className={`font-sans py-12 ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="container px-5 mx-auto mb-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3">
              Admin Dashboard
            </h1>
            <p className={`text-base ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage your store efficiently with these key metrics
            </p>
          </div>

          {/* Stats Cards in soft modern SaaS UI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {cards.map((card, index) => (
               <div
                  key={index}
                  className={`relative flex items-center p-6 space-x-6 bg-white rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md ${
                    mode === 'dark' ? 'bg-gray-800 border-gray-700' : ''
                  }`}
               >
                  <div className={`p-4 rounded-2xl ${card.color}`}>
                     {card.icon}
                  </div>
                  <div>
                     <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {card.title}
                     </p>
                     <h2 className={`text-3xl font-extrabold pb-1 ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {card.value}
                     </h2>
                     {card.subtitle && (
                        <p className={`text-xs font-medium ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                           {card.subtitle}
                        </p>
                     )}
                  </div>
               </div>
            ))}
          </div>

          <div className={`rounded-3xl overflow-hidden p-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100'}`}>
            <DashboardTab />
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Dashboard;
