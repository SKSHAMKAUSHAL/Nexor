import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import Logo from '../logo/Logo';

function Footer() {
  const footerBg = '#111111';
  const footerText = '#FFFFFF';
  const footerMuted = '#757575';
  const footerBorder = '#333333';

  return (
    <footer className="font-outfit" style={{ backgroundColor: footerBg, color: footerText }}>
      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Brand Info */}
        <div className="flex flex-col gap-4">
          <Logo size="medium" showText={true} variant="white" />
          <p className="text-sm font-medium mt-4 max-w-xs" style={{ color: footerMuted }}>
            Elevate your everyday. Discover premium apparel, footwear, and accessories designed for performance and style.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-white hover:text-black transition-colors"><FaFacebookF size={14} /></a>
            <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-white hover:text-black transition-colors"><FaTwitter size={14} /></a>
            <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-white hover:text-black transition-colors"><FaInstagram size={14} /></a>
            <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-800 hover:bg-white hover:text-black transition-colors"><FaYoutube size={14} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Shop</h3>
          <Link to="/allproducts" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>All Products</Link>
          <Link to="/allproducts?filter=Man" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Man</Link>
          <Link to="/allproducts?filter=Woman" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Woman</Link>
          <Link to="/allproducts?filter=kid" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>kid</Link>
          <Link to="/allproducts?filter=sale" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Sale</Link>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Get Help</h3>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Order Status</Link>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Shipping & Delivery</Link>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Returns & Exchanges</Link>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>PayMant Options</Link>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Contact Us</Link>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-2">About Nexor</h3>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>News</Link>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Careers</Link>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Investors</Link>
          <Link to="/" className="text-sm hover:text-white transition-colors" style={{ color: footerMuted }}>Sustainability</Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t" style={{ borderColor: footerBorder }}>
        <div className="container mx-auto py-6 px-5 flex flex-wrap flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className="flex items-center gap-2 text-white font-medium text-xs">
              <HiLocationMarker size={16} />
              <span>India</span>
            </div>
            <p className="text-xs" style={{ color: footerMuted }}>
               2026 Nexor, Inc. All Rights Reserved
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: footerMuted }}>
            <Link to="/" className="hover:text-white transition-colors">Guides</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Sale</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
