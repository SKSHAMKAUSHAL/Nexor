import Header from './Header'
import Footer from '../footer/Footer'
import FloatingCart from '../cart/FloatingCart'
import PropTypes from 'prop-types';

function Layout({children}) {
  return (
    <div className="font-sans text-[#111111] bg-white min-h-screen">
        <Header/>
        <main className="min-h-screen relative w-full overflow-hidden">
            {children}
        </main>
        <Footer/>
        <FloatingCart />
    </div>
  )
}

export default Layout

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};
