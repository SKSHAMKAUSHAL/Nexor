import { Suspense, lazy, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import MyState from './context/data/myState';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/home/Home'));
const Order = lazy(() => import('./pages/order/Order'));
const Cart = lazy(() => import('./pages/cart/Cart'));
const Dashboard = lazy(() => import('./pages/admin/dashboard/Dashboard'));
const NoPage = lazy(() => import('./pages/nopage/NoPage'));
const Login = lazy(() => import('./pages/registration/Login'));
const Signup = lazy(() => import('./pages/registration/Signup'));
const ProductInfo = lazy(() => import('./pages/productInfo/ProductInfo'));
const AddProduct = lazy(() => import('./pages/admin/page/AddProduct'));
const UpdateProduct = lazy(() => import('./pages/admin/page/UpdateProduct'));
const Wishlist = lazy(() => import('./pages/wishlist/Wishlist'));
const Allproducts = lazy(() => import('./pages/allproducts/Allproducts'));

import Loader from './components/loader/Loader';
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show initial Loader for 2 seconds (giving background components time to mount/fetch data)
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000); 
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <MyState>
      {/* Explicit Top-Level App Loader - Controls initial app mount */}
      <Loader fullScreen={true} isVisible={initialLoading} />

      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<Loader fullScreen={true} isVisible={true} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/allproducts" element={<Allproducts />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/order" element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/dashboard" element={
              <ProtectedRouteForAdmin>
                <Dashboard />
              </ProtectedRouteForAdmin>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/productinfo/:id" element={<ProductInfo />} />
            <Route path="/addproduct" element={
              <ProtectedRouteForAdmin>
                <AddProduct />
              </ProtectedRouteForAdmin>
            } />
            <Route path="/updateproduct" element={
              <ProtectedRouteForAdmin>
                <UpdateProduct />
              </ProtectedRouteForAdmin>
            } />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Suspense>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme="colored"
          limit={3}
        />
      </Router>
    </MyState>
  );
}
export default App;
// Protected Route for authenticated users
export const ProtectedRoute = ({ children }) => {
  const user = getStoredUser();
  if (user?.user?.uid) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};
// Protected Route for admin users
const ProtectedRouteForAdmin = ({ children }) => {
  const admin = getStoredUser();
  const isAdmin = admin?.profile?.role === 'admin';
  if (!admin?.user?.uid || !isAdmin) {
    console.warn('Admin access denied - Redirecting to login');
    return <Navigate to="/login" />;
  }
  return children;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
ProtectedRouteForAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};
