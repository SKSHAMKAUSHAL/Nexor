import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';

function NoPage() {
  return (
    <Layout>
      <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 font-sans">
        <div className="max-w-2xl w-full text-center flex flex-col items-center">
          {/* Stark 404 Number */}
          <h1 className="text-[120px] sm:text-[180px] md:text-[220px] leading-none font-oswald font-medium text-[#111111] tracking-tighter mb-4">
            404
          </h1>

          {/* Message */}
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#111111] font-oswald uppercase tracking-tight">
              We can&apos;t find that page
            </h2>
            <p className="text-base text-gray-500 max-w-md mx-auto">
              Sorry, the page you are looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            <Link 
              to="/" 
              className="w-full sm:w-auto px-8 py-4 bg-[#111111] text-white text-[15px] font-medium rounded-full hover:bg-gray-800 transition-colors"
            >
              Return Home
            </Link>
            
            <Link 
              to="/allproducts" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-[#111111] text-[15px] font-medium rounded-full border border-[#111111] hover:border-gray-500 hover:text-gray-500 transition-colors"
            >
              Shop All Products
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NoPage;
