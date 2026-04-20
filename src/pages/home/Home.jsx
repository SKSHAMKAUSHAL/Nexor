import Layout from '../../components/layout/Layout';
import HeroSection from '../../components/heroSection/HeroSection';
import Feature from '../../components/feature/Feature';
import ShopBySport from '../../components/shopBySport/ShopBySport';
import { Link } from 'react-router-dom';

function Home() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }
  const isAdmin = user?.profile?.role === 'admin';

  return (
    <Layout>
      {isAdmin && (
        <div className="flex justify-center mt-4">
          <Link to="/dashboard">
            <button
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full font-bold transition-all duration-300 hover:scale-105"
            >
              Go to Admin Dashboard
            </button>
          </Link>
        </div>
      )}
      <HeroSection />
      <br/>
      <br/>

      <Feature />
        <br/>
      <br/>
      <ShopBySport />
    </Layout>
  );
}

export default Home;
