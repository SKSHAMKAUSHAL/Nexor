import { useContext, useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import myContext from '../../context/data/myContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { addToCart } from '../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { fireDB } from '../../firebase/FirebaseConfig';
import { FaHeart, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

function ProductInfo() {
    const context = useContext(myContext);
    const { setLoading, mode } = context;

    const [products, setProducts] = useState('')
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const params = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist);
    
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = user?.user?.uid;

    // Get product images
    const productImages = products && products.images && Array.isArray(products.images) && products.images.length > 0 
        ? products.images 
        : products.imageUrl ? [products.imageUrl] : [];

    const getProductData = async () => {
        setLoading(true)
        try {
            const productSnap = await getDoc(doc(fireDB, "products", params.id))
            const data = productSnap.data();
            // Ensure id exists for wishlist/cart logic
            setProducts({ id: productSnap.id || params.id, ...data });
            setLoading(false)
        } catch (error) {
            toast.error("Failed to load product")
            setLoading(false)
        }
    }


    useEffect(() => {
        getProductData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [selectedVariation, setSelectedVariation] = useState('');

    // Helper to validate URL
    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        if (!/^https?:\/\//i.test(url)) return false; // restrict to http/https
        try { new URL(url); return true; } catch { return false; }
    };

    // Sanitize product before adding to cart to avoid non-serializable values (e.g., Firestore Timestamp)
    const sanitizeForCart = (p, selectedVariation) => {
        const safe = { ...p };
        // Remove or convert non-serializable values
        if (safe.time && typeof safe.time === 'object') {
            try {
                // Prefer milliseconds if available, else drop
                safe.time = Date.now();
            } catch {
                delete safe.time;
            }
        }
        // Keep only necessary fields to keep cart lean
        return {
            id: safe.id,
            title: safe.title,
            price: safe.price,
            imageUrl: Array.isArray(safe.images) && safe.images.length && isValidUrl(safe.images[0])
                ? safe.images[0]
                : (isValidUrl(safe.imageUrl) ? safe.imageUrl : ''),
            description: safe.description,
            selectedVariation: selectedVariation || ''
        };
    };

    // add to cart
    const addCart = (products) => {
        const payload = sanitizeForCart(products, selectedVariation);
        dispatch(addToCart(payload))
        toast.success('add to cart');
    }

    // toggle wishlist
    const toggleWishlist = () => {
        const payload = sanitizeForCart(products, selectedVariation);
        const isInWishlist = wishlist.some(item => item.id === products.id);
        
        if (isInWishlist) {
            dispatch(removeFromWishlist(products.id));
            toast.info('Removed from wishlist');
        } else {
            dispatch(addToWishlist(payload));
            toast.success('Added to wishlist ❤️');
        }
    }

    const isInWishlist = wishlist.some(item => item.id === products.id);


    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [sizeUnit, setSizeUnit] = useState('in');
    
    // State for image zoom feature
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePos({ x, y });
    };  
    // Size guide data based on screenshots
    const sizeGuideData = {
        in: [
            { size: 'S', chest: '33.5-36', waist: '28.5-31', hip: '28.5-31' },
            { size: 'M', chest: '36-38', waist: '31-33.5', hip: '31-33.5' },
            { size: 'L', chest: '38-40.5', waist: '33.5-36', hip: '33.5-36' },
            { size: 'XL', chest: '40.5-43', waist: '36-38', hip: '36-38' },
            { size: '2XL', chest: '43-45.5', waist: '38-41', hip: '38-41' },
            { size: '3XL', chest: '45.5-49', waist: '41-44', hip: '41-44' },
        ],
        cm: [
            { size: 'S', chest: '85.1-91.4', waist: '72.4-78.7', hip: '72.4-78.7' },
            { size: 'M', chest: '91.4-96.5', waist: '78.7-85.1', hip: '78.7-85.1' },
            { size: 'L', chest: '96.5-102.9', waist: '85.1-91.4', hip: '85.1-91.4' },
            { size: 'XL', chest: '102.9-109.2', waist: '91.4-96.5', hip: '91.4-96.5' },
            { size: '2XL', chest: '109.2-115.6', waist: '96.5-104.1', hip: '96.5-104.1' },
            { size: '3XL', chest: '115.6-124.5', waist: '104.1-111.8', hip: '104.1-111.8' },
        ]
    };

    // Default sizes mimicking the image
    const availableSizes = products?.sizes && products.sizes.length > 0 ? products.sizes : ['S', 'M', 'L', 'XL', '2XL', '3XL'];

    // Calculate original price for UI if needed (to show the discount like in image)
    const currentPrice = products?.price || 12796;
    const originalPrice = products?.originalPrice || Math.round(currentPrice * 1.25);
    const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

    return (
        <Layout>
            <section className="text-gray-900 body-font font-sans" style={{ 
                backgroundColor: mode === 'dark' ? '#111111' : 'white',
                color: mode === 'dark' ? '#f5f5f5' : '#111111' 
            }}>
                <div className="max-w-[1000px] px-5 py-10 mx-auto relative">
                    {products && 
                    <div className="flex flex-col lg:flex-row gap-10 relative">
                        
                        {/* LEFT: Complete Image Section (Thumbnails + Main) */}
                        <div className="lg:w-[65%] flex flex-col-reverse md:flex-row gap-4">
                            {/* Option 1: Thumbnail Gallery */}
                            {productImages.length > 1 && (
                                <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible w-full md:w-16 shrink-0 order-last md:order-first">
                                    {productImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative overflow-hidden transition-all duration-300 shrink-0 w-16 h-16 md:w-auto md:h-16 ${
                                                idx === selectedImageIndex 
                                                    ? 'opacity-50' 
                                                    : 'hover:opacity-75'
                                            }`}
                                        >
                                            {isValidUrl(img) ? (
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    className="w-full h-full object-cover rounded"
                                                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Img'; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded flex items-center justify-center text-[10px]"
                                                    style={{ backgroundColor: mode === 'dark' ? '#333' : '#f5f5f5' }}
                                                >No Img</div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Option 2: Main Image */}
                            <div 
                                className="relative flex-1 group flex justify-center items-center overflow-hidden cursor-crosshair w-full h-[450px] lg:h-[550px] max-h-[70vh] rounded bg-transparent"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                onMouseMove={handleMouseMove}
                            >
                                {isValidUrl(productImages[selectedImageIndex]) ? (
                                    <>
                                        <img
                                            alt={products.title}
                                            className="w-auto h-full max-w-full max-h-full object-contain"
                                            src={productImages[selectedImageIndex]}
                                            loading="lazy"
                                            onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image'; }}
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm">
                                        No image available
                                    </div>
                                )}
                                
                                {/* Navigation Arrows inside Main Image just like the clone */}
                                {productImages.length > 1 && (
                                    <div className="absolute bottom-6 right-6 flex gap-2">
                                        <button
                                            onClick={() => setSelectedImageIndex((prev) => 
                                                prev === 0 ? productImages.length - 1 : prev - 1
                                            )}
                                            style={{ backgroundColor: mode === 'dark' ? '#333' : 'white' }}
                                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-800"
                                        >
                                            <FaChevronLeft size={14} color={mode === 'dark' ? 'white' : 'black'} />
                                        </button>
                                        <button
                                            onClick={() => setSelectedImageIndex((prev) => 
                                                (prev + 1) % productImages.length
                                            )}
                                            style={{ backgroundColor: mode === 'dark' ? '#333' : 'white' }}
                                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-gray-800"
                                        >
                                            <FaChevronRight size={14} color={mode === 'dark' ? 'white' : 'black'} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cirular Zoom Overlay (Shows on hover over the product details) */}
                        {isHovering && isValidUrl(productImages[selectedImageIndex]) && (
                            <div 
                                className="hidden lg:flex absolute top-[10%] lg:-right-4 xl:-right-10 w-[400px] h-[400px] rounded-full z-50 pointer-events-none shadow-2xl border items-center justify-center overflow-hidden"
                                style={{
                                    backgroundImage: `url(${productImages[selectedImageIndex]})`,
                                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                                    backgroundSize: '250%',
                                    backgroundColor: mode === 'dark' ? '#111' : 'white',
                                    borderColor: mode === 'dark' ? '#444' : '#e5e5e5',
                                }}
                            />
                        )}

                        {/* RIGHT: Product Details Section */}
                        <div className="lg:w-[35%] w-full lg:pl-8 lg:py-6 mt-6 lg:mt-0 flex flex-col">
                            <h1 className="text-2xl font-medium mb-1">
                                {products.title}
                            </h1>
                            <h2 className="text-base mb-4 font-medium" style={{ color: mode === 'dark' ? '#ccc' : '#707072' }}>
                                {products.category || "Man's Therma-FIT Jacket"}
                            </h2>
                            
                            <div className="mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-medium">
                                        ₹{currentPrice.toLocaleString('en-IN')}
                                    </span>
                                    {originalPrice > currentPrice && (
                                        <span className="text-base line-through" style={{ color: mode === 'dark' ? '#888' : '#707072' }}>
                                            ₹{originalPrice.toLocaleString('en-IN')}
                                        </span>
                                    )}
                                    {discountPercent > 0 && (
                                        <span className="text-base font-medium text-green-600">
                                            {discountPercent}% off
                                        </span>
                                    )}
                                </div>
                                <p className="text-[15px] mt-1 text-[#707072]" style={{ color: mode === 'dark' ? '#888' : '#707072' }}>
                                    Inclusive of all taxes
                                </p>
                            </div>

                            {/* Sizes */}
                            <div className="mt-8 mb-8">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-base">Select Size</span>
                                    <span 
                                        className="font-medium text-base text-[#707072] cursor-pointer hover:text-black transition flex items-center gap-1" 
                                        style={{ color: mode === 'dark' ? '#ccc' : '#707072' }}
                                        onClick={() => setIsSizeGuideOpen(true)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
                                            <line x1="6" y1="7" x2="6" y2="10"></line>
                                            <line x1="10" y1="7" x2="10" y2="10"></line>
                                            <line x1="14" y1="7" x2="14" y2="10"></line>
                                            <line x1="18" y1="7" x2="18" y2="10"></line>
                                        </svg>
                                        Size Guide
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {availableSizes.map((size) => {
                                        const isOutOfStock = size === '3XL'; // Mocking 3XL out of stock as in image
                                        const active = selectedVariation === size;
                                        return (
                                            <button
                                                key={size}
                                                disabled={isOutOfStock}
                                                onClick={() => setSelectedVariation(size)}
                                                className={`py-3 rounded-[4px] border border-[#e5e5e5] text-base font-medium transition-all ${
                                                    isOutOfStock 
                                                    ? 'bg-[#f7f7f7] text-[#c8c8c8] cursor-not-allowed opacity-50' 
                                                    : active 
                                                        ? 'border-black border-2' 
                                                        : 'hover:border-black hover:border'
                                                }`}
                                                style={{
                                                    borderColor: active ? (mode === 'dark' ? 'white' : 'black') : (mode === 'dark' ? '#333' : '#e5e5e5'),
                                                    borderWidth: active ? '1.5px' : '1px',
                                                    color: isOutOfStock ? '#ccc' : (mode === 'dark' ? 'white' : 'black'),
                                                    backgroundColor: active ? 'transparent' : (isOutOfStock ? (mode === 'dark' ? '#222' : '#f7f7f7') : 'transparent')
                                                }}
                                            >
                                                {size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 mb-10">
                                <button  
                                    onClick={() => {
                                        if (!selectedVariation) {
                                            toast.error('Please select a size');
                                            return;
                                        }
                                        addCart({ ...products, selectedVariation });
                                    }} 
                                    className="w-full py-4 rounded-full font-medium text-base transition-all hover:opacity-75"
                                    style={{
                                        backgroundColor: mode === 'dark' ? 'white' : 'black',
                                        color: mode === 'dark' ? 'black' : 'white'
                                    }}
                                >
                                    Add to Bag
                                </button>
                                
                                <button 
                                    onClick={toggleWishlist}
                                    className="w-full py-4 rounded-full font-medium text-base flex items-center justify-center gap-2 transition-all hover:border-black"
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: mode === 'dark' ? 'white' : 'black',
                                        border: `1px solid ${mode === 'dark' ? '#444' : '#e5e5e5'}`
                                    }}
                                >
                                    Favourite
                                    <FaHeart size={16} className={isInWishlist ? 'text-red-500' : ''} />
                                </button>
                            </div>

                            {/* Description specific to Nexorproduct */}
                            <div className="text-base leading-7 space-y-4" style={{ color: mode === 'dark' ? '#ddd' : '#111' }}>
                                <p>
                                    {products.description && products.description.length > 10 
                                        ? products.description 
                                        : "Researched in a lab, tested on the trails. This jacket has the tech you need to take on frigid miles down-filled baffles for warmth and AeroLoft perforations for breathability. Stretchy panels help you move with ease and adjustable details let you fine-tune your fit. Don't need the warmth? It packs into the pocket for compact storage."
                                    }
                                </p>
                                {products?.colors && products.colors.length > 0 ? (
                                    <ul className="list-disc pl-5 mt-4">
                                        <li>Colour Shown: {products.colors.join(', ')}</li>
                                    </ul>
                                ) : (
                                    <ul className="list-disc pl-5 mt-4">
                                        <li>Colour Shown: Safety Orange/Cream</li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>}

                    {/* Size Guide Modal */}
                    {isSizeGuideOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm"
                            onClick={(e) => {
                                if (e.target === e.currentTarget) setIsSizeGuideOpen(false);
                            }}
                        >
                            <div 
                                className="relative w-full max-w-[800px] rounded-2xl shadow-xl overflow-hidden"
                                style={{ 
                                    backgroundColor: mode === 'dark' ? '#1a1a1a' : '#ffffff',
                                    color: mode === 'dark' ? '#f5f5f5' : '#111111'
                                }}
                            >
                                {/* Header */}
                                <div className="p-8 pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-[28px] font-medium">Size Guide</h2>
                                        <button 
                                            onClick={() => setIsSizeGuideOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                            style={{ backgroundColor: mode === 'dark' ? 'transparent' : 'white', color: mode === 'dark' ? '#f5f5f5' : '#111111', 
                                                     ':hover': { backgroundColor: mode === 'dark' ? '#333' : '#f3f4f6' } }}
                                        >
                                            <FaTimes size={20} />
                                        </button>
                                    </div>
                                    <p className="text-[#757575] text-[15px]" style={{ color: mode === 'dark' ? '#aaa' : '#757575' }}>
                                        {products.title || "NexorACG 'Lava Loft' Man's Therma-FIT Jacket"}
                                    </p>
                                </div>

                                {/* Toggle & Instructions */}
                                <div className="px-8 pb-6 flex justify-between items-end">
                                    <p className="text-[15px] font-medium">Below are body measureMants this product fits</p>
                                    <div className="flex border rounded-full overflow-hidden" style={{ borderColor: mode === 'dark' ? '#444' : '#e5e5e5' }}>
                                        <button 
                                            onClick={() => setSizeUnit('in')}
                                            className={`px-4 py-1.5 text-sm font-medium transition-colors ${sizeUnit === 'in' ? (mode === 'dark' ? 'bg-white text-black border border-white rounded-full' : 'bg-white text-black border border-black rounded-full') : (mode === 'dark' ? 'bg-[#1a1a1a] text-[#aaa]' : 'bg-[#f5f5f5] text-[#757575]')}`}
                                        >
                                            in
                                        </button>
                                        <button 
                                            onClick={() => setSizeUnit('cm')}
                                            className={`px-4 py-1.5 text-sm font-medium transition-colors ${sizeUnit === 'cm' ? (mode === 'dark' ? 'bg-white text-black border border-white rounded-full -ml-[1px]' : 'bg-white text-black border border-black rounded-full -ml-[1px]') : (mode === 'dark' ? 'bg-[#1a1a1a] text-[#aaa]' : 'bg-[#f5f5f5] text-[#757575]')}`}
                                        >
                                            cm
                                        </button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="px-8 pb-10 overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[500px]">
                                        <thead>
                                            <tr style={{ backgroundColor: mode === 'dark' ? '#222' : '#f9f9f9',  borderTop: `1px solid ${mode === 'dark' ? '#444' : '#e5e5e5'}`, borderBottom: `1px solid ${mode === 'dark' ? '#444' : '#e5e5e5'}` }}>
                                                <th className="py-4 px-4 font-medium text-[15px] w-1/4">Size</th>
                                                <th className="py-4 px-4 font-medium text-[15px] w-1/4">Chest</th>
                                                <th className="py-4 px-4 font-medium text-[15px] w-1/4">Waist</th>
                                                <th className="py-4 px-4 font-medium text-[15px] w-1/4">Hip</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sizeGuideData[sizeUnit].map((row, idx) => (
                                                <tr key={row.size} 
                                                    style={{ 
                                                        borderBottom: `1px solid ${mode === 'dark' ? '#333' : '#f0f0f0'}`,
                                                        backgroundColor: mode === 'dark' ? (idx % 2 === 0 ? '#1a1a1a' : '#1f1f1f') : (idx % 2 === 0 ? 'white' : '#fafafa') 
                                                    }}
                                                >
                                                    <td className="py-4 px-4 text-[15px] font-medium">{row.size}</td>
                                                    <td className="py-4 px-4 text-[15px]" style={{ color: mode === 'dark' ? '#ccc' : '#444' }}>{row.chest}</td>
                                                    <td className="py-4 px-4 text-[15px]" style={{ color: mode === 'dark' ? '#ccc' : '#444' }}>{row.waist}</td>
                                                    <td className="py-4 px-4 text-[15px]" style={{ color: mode === 'dark' ? '#ccc' : '#444' }}>{row.hip}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

        </Layout>
    )
}

export default ProductInfo