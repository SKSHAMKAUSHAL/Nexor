import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../../context/data/myContext';

function UpdateProduct() {
    const context = useContext(myContext);
    const { products, setProducts, updateProduct, mode } = context;
    const navigate = useNavigate();

    // Category mapping by type
    const categoryByType = {
        man: ['Shoes', 'Clothing', 'Accessories', 'Equipment'],
        woman: ['Shoes', 'Clothing', 'Accessories', 'Equipment'],
        unisex: ['Shoes', 'Clothing', 'Accessories', 'Equipment'],
        child: ['Shoes', 'Clothing', 'Accessories', 'Equipment'],
        other: ['Other']
    };

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrls, setImageUrls] = useState(['']);
    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');

    useEffect(() => {
        const incoming = Array.isArray(products?.images) && products.images.length
            ? products.images
            : (products?.imageUrl ? [products.imageUrl] : ['']);
        setImageUrls(incoming.length ? incoming : ['']);
    }, [products?.images, products?.imageUrl]);

    const isValidUrl = (string) => {
        if (!string || typeof string !== 'string') return false;
        if (!/^https?:\/\//i.test(string)) return false;
        try { new URL(string); return true; } catch { return false; }
    };

    const validateFields = () => {
        const newErrors = {};
        if (!products.title || products.title.trim() === '') newErrors.title = 'Product title is required';
        if (!products.price || String(products.price).trim() === '') newErrors.price = 'Price is required';
        else if (isNaN(products.price) || parseFloat(products.price) <= 0) newErrors.price = 'Please enter a valid price';
        
        if (products.salePrice && (isNaN(products.salePrice) || parseFloat(products.salePrice) < 0 || parseFloat(products.salePrice) >= parseFloat(products.price))) {
             newErrors.salePrice = 'Sale price must be valid and less than original price';
        }

        const validUrls = imageUrls.filter(url => url.trim() !== '' && isValidUrl(url));
        if (validUrls.length === 0) newErrors.imageUrl = 'At least one valid image URL is required';
        
        if (!products.category || products.category.trim() === '') newErrors.category = 'Category is required';
        if (!products.description || products.description.trim() === '') newErrors.description = 'Description is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
        const validUrls = newUrls.filter(url => url.trim() !== '');
        setProducts({ ...products, imageUrl: validUrls[0] || '', images: validUrls });
        if (errors.imageUrl) setErrors({ ...errors, imageUrl: '' });
    };

    const addImageUrlInput = () => { if (imageUrls.length < 5) setImageUrls([...imageUrls, '']); };
    const removeImageUrl = (index) => {
        if (imageUrls.length > 1) {
            const newUrls = imageUrls.filter((_, i) => i !== index);
            setImageUrls(newUrls);
            const validUrls = newUrls.filter(url => url.trim() !== '');
            setProducts({ ...products, imageUrl: validUrls[0] || '', images: validUrls });
        }
    };

    const handleUpdateProduct = async () => {
        if (!validateFields()) return;
        setIsSubmitting(true);
        const success = await updateProduct();
        setIsSubmitting(false);
        if (success) {
            navigate('/dashboard');
        }
    };

    const setTypeAndResetVariations = (value) => {
        setProducts({ ...products, type: value, sizes: [], colors: [], category: '' });
    };

    // Modern Theme Variables
    const isDark = mode === 'dark';
    const bgTheme = isDark ? '#0a0a0a' : '#f9fafb';
    const cardBg = isDark ? '#1a1a1a' : '#ffffff';
    const textTheme = isDark ? '#f3f4f6' : '#111827';
    const textSub = isDark ? '#9ca3af' : '#6b7280';
    const inputBg = isDark ? '#262626' : '#ffffff';
    const inputBorder = isDark ? '#404040' : '#d1d5db';
    const inputFocusBorder = isDark ? '#60a5fa' : '#2563eb';

    return (
        <div className="min-h-screen py-10 px-4 font-sans" style={{ backgroundColor: bgTheme }}>
            <div className="w-full max-w-4xl mx-auto animate-fade-in" style={{ color: textTheme }}>
                
                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1 cursor-pointer hover:underline text-sm" 
                             style={{ color: textSub }} 
                             onClick={() => navigate('/dashboard')}>
                            <span>← Back to Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight">Update Product</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-5 py-2.5 rounded-lg font-medium text-sm border transition-colors hover:bg-opacity-10 hover:bg-gray-500"
                            style={{ borderColor: inputBorder, color: textTheme }}
                        >
                            Discard
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdateProduct}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Main Details) */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Basic Info Card */}
                        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: cardBg, borderColor: inputBorder }}>
                            <h2 className="text-lg font-semibold mb-5">General Information</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Product Title *</label>
                                    <input
                                        type="text"
                                        value={products.title || ''}
                                        onChange={(e) => setProducts({ ...products, title: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textTheme }}
                                        placeholder="e.g. Classic Fit T-Shirt"
                                    />
                                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Description *</label>
                                    <textarea
                                        rows="5"
                                        value={products.description || ''}
                                        onChange={(e) => setProducts({ ...products, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 resize-y"
                                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textTheme }}
                                        placeholder="Describe the product details, material, fit, etc."
                                    ></textarea>
                                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: cardBg, borderColor: inputBorder }}>
                            <h2 className="text-lg font-semibold mb-5">Media</h2>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Image URLs * (First image is thumbnail)</label>
                            <div className="space-y-3">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textTheme }}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        {imageUrls.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeImageUrl(index)}
                                                className="p-2.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors border border-transparent hover:border-red-200"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
                            
                            {imageUrls.length < 5 && (
                                <button
                                    type="button"
                                    onClick={addImageUrlInput}
                                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    + Add another image URL
                                </button>
                            )}
                        </div>

                        {/* Pricing Card */}
                        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: cardBg, borderColor: inputBorder }}>
                            <h2 className="text-lg font-semibold mb-5">Pricing</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Base Price (₹) *</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={products.price || ''}
                                            onChange={(e) => setProducts({ ...products, price: e.target.value })}
                                            className="w-full pl-8 pr-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textTheme }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Sale Price (₹) (Optional)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={products.salePrice || ''}
                                            onChange={(e) => setProducts({ ...products, salePrice: e.target.value })}
                                            className="w-full pl-8 pr-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                            style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textTheme }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.salePrice && <p className="mt-1 text-sm text-red-500">{errors.salePrice}</p>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Organization & Variants) */}
                    <div className="space-y-8">
                        
                        {/* Organization Card */}
                        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: cardBg, borderColor: inputBorder }}>
                            <h2 className="text-lg font-semibold mb-5">Organization</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Target Audience</label>
                                    <select
                                        value={products.type || ''}
                                        onChange={(e) => setTypeAndResetVariations(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                                        style={{ 
                                            backgroundColor: inputBg, 
                                            borderColor: inputBorder, 
                                            color: textTheme,
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`
                                        }}
                                    >
                                        <option value="" disabled>Select Audience</option>
                                        <option value="man">Men</option>
                                        <option value="woman">Women</option>
                                        <option value="unisex">Unisex (Men & Women)</option>
                                        <option value="child">Kids</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Category *</label>
                                    <select
                                        value={products.category || ''}
                                        onChange={(e) => setProducts({ ...products, category: e.target.value, subCategory: '' })}
                                        disabled={!products.type}
                                        className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em] disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ 
                                            backgroundColor: inputBg, 
                                            borderColor: inputBorder, 
                                            color: textTheme,
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`
                                        }}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {products.type && categoryByType[products.type]?.map((cat, index) => (
                                            <option key={index} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                                </div>

                                {products.category && (
                                    <div className="animate-fade-in">
                                        <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Specific Item</label>
                                        <select
                                            value={products.subCategory || ''}
                                            onChange={(e) => setProducts({ ...products, subCategory: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em]"
                                            style={{ 
                                                backgroundColor: inputBg, 
                                                borderColor: inputBorder, 
                                                color: textTheme,
                                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`
                                            }}
                                        >
                                            <option value="" disabled>Select Specific Item</option>
                                            {(() => {
                                                const SUB_CATEGORIES = {
                                                    'Shoes': ['Running', 'Basketball', 'Football', 'Training & Gym', 'Lifestyle'],
                                                    'Clothing': ['T-Shirts & Tops', 'Hoodies & Sweatshirts', 'Jackets & Vests', 'Pants & Tights', 'Shorts', 'Sports Bras'],
                                                    'Accessories': ['Bags & Backpacks', 'Socks', 'Hats & Headwear', 'Water Bottles'],
                                                    'Equipment': ['Balls', 'Yoga Mats', 'Resistance Bands', 'Weights']
                                                };
                                                return SUB_CATEGORIES[products.category]?.map((item, idx) => (
                                                    <option key={idx} value={item}>{item}</option>
                                                )) || <option disabled>No items available</option>;
                                            })()}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Variants Card */}
                        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: cardBg, borderColor: inputBorder }}>
                            <h2 className="text-lg font-semibold mb-5">Variants</h2>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Sizes</label>
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        value={newSize}
                                        onChange={(e) => setNewSize(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newSize.trim() && !products.sizes?.includes(newSize.trim())) {
                                                    setProducts({ ...products, sizes: [...(products.sizes || []), newSize.trim()] });
                                                    setNewSize('');
                                                }
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 pr-20 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textTheme }}
                                        placeholder="Add size (e.g. M)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newSize.trim() && !products.sizes?.includes(newSize.trim())) {
                                                setProducts({ ...products, sizes: [...(products.sizes || []), newSize.trim()] });
                                                setNewSize('');
                                            }
                                        }}
                                        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors text-sm"
                                        style={{ backgroundColor: isDark ? '#333' : '#f3f4f6', color: textTheme }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {products.sizes?.map((size, index) => (
                                        <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-sm font-medium" style={{ backgroundColor: isDark ? '#1e3a8a' : '#eff6ff', borderColor: isDark ? '#1e40af' : '#bfdbfe', color: isDark ? '#bfdbfe' : '#1d4ed8' }}>
                                            {size}
                                            <button
                                                type="button"
                                                onClick={() => setProducts({ ...products, sizes: products.sizes.filter((_, i) => i !== index) })}
                                                className="hover:text-blue-900 ml-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {(!products.sizes || products.sizes.length === 0) && <p className="text-sm italic" style={{ color: textSub }}>No sizes added.</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1.5" style={{ color: textTheme }}>Colors</label>
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newColor.trim() && !products.colors?.includes(newColor.trim())) {
                                                    setProducts({ ...products, colors: [...(products.colors || []), newColor.trim()] });
                                                    setNewColor('');
                                                }
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 pr-20 rounded-lg border outline-none transition-all focus:ring-2 focus:ring-blue-500/20"
                                        style={{ backgroundColor: inputBg, borderColor: inputBorder, color: textTheme }}
                                        placeholder="Add color (e.g. Red)"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newColor.trim() && !products.colors?.includes(newColor.trim())) {
                                                setProducts({ ...products, colors: [...(products.colors || []), newColor.trim()] });
                                                setNewColor('');
                                            }
                                        }}
                                        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors text-sm"
                                        style={{ backgroundColor: isDark ? '#333' : '#f3f4f6', color: textTheme }}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {products.colors?.map((color, index) => (
                                        <div key={index} className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm font-medium" style={{ backgroundColor: isDark ? '#064e3b' : '#f0fdf4', borderColor: isDark ? '#065f46' : '#bbf7d0', color: isDark ? '#a7f3d0' : '#15803d' }}>
                                            {color}
                                            <button
                                                type="button"
                                                onClick={() => setProducts({ ...products, colors: products.colors.filter((_, i) => i !== index) })}
                                                className="hover:text-green-900 ml-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {(!products.colors || products.colors.length === 0) && <p className="text-sm italic" style={{ color: textSub }}>No colors added.</p>}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
