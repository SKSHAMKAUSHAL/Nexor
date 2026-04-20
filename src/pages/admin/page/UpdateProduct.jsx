import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../../context/data/myContext';

function UpdateProduct() {
    const context = useContext(myContext);
    const { products, setProducts, updateProduct, mode } = context;
    const navigate = useNavigate();

    // Category mapping by type
    const categoryByType = {
        man: ['T-Shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Vests', 'Shorts', 'Pants & Trousers', 'Tracksuits', 'Innerwear', 'Socks', 'Swimwear', 'Jerseys', 'Compression Wear', 'Other'],
        Woman: ['T-Shirts & Tops', 'Sports Bras', 'Hoodies & Sweatshirts', 'Jackets', 'Leggings & Tights', 'Shorts', 'Skirts & Dresses', 'Tracksuits', 'Pants & Joggers', 'Innerwear', 'Swimwear', 'Other'],
        child: ['T-Shirts', 'Hoodies', 'Jackets', 'Shorts', 'Pants', 'Tracksuits', 'School Shoes', 'Socks', 'Other'],
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

    // NikeTheme Variables
    const bgTheme = mode === 'dark' ? '#111111' : '#FFFFFF';
    const textTheme = mode === 'dark' ? '#FFFFFF' : '#111111';
    const inputBg = mode === 'dark' ? '#222222' : '#F5F5F5';
    const labelColor = mode === 'dark' ? '#A3A3A3' : '#757575';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-outfit" style={{ backgroundColor: bgTheme }}>
            <div className="w-full max-w-2xl bg-transparent animate-fade-in" style={{ color: textTheme }}>
                
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-6 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logo.png" alt="Logo" className="h-12 w-auto" style={{ filter: mode === 'dark' ? 'invert(1)' : 'none' }} />
                    </div>
                    <h1 className='text-3xl font-oswald font-medium uppercase tracking-wide' style={{ color: textTheme }}>
                        Update Product
                    </h1>
                    <p className="text-[15px] mt-2" style={{ color: labelColor }}>
                        Modify the details for this product below
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Product Title *
                            </label>
                            <input
                                type="text"
                                value={products.title || ''}
                                onChange={(e) => setProducts({ ...products, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                            />
                            {errors.title && <p className="mt-1 text-sm text-[#9E3500]">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Price (?) *
                            </label>
                            <input
                                type="number"
                                value={products.price || ''}
                                onChange={(e) => setProducts({ ...products, price: e.target.value })}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white font-oswald"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                            />
                            {errors.price && <p className="mt-1 text-sm text-[#9E3500]">{errors.price}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Category *
                            </label>
                            <select
                                value={products.category || ''}
                                onChange={(e) => setProducts({ ...products, category: e.target.value })}
                                disabled={!products.type}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors appearance-none border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white disabled:opacity-50"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                            >
                                <option value="" disabled>Select Category (Select Type First)</option>
                                {products.type && categoryByType[products.type]?.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-[#9E3500]">{errors.category}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Product Type
                            </label>
                            <select
                                value={products.type || ''}
                                onChange={(e) => setTypeAndResetVariations(e.target.value)}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors appearance-none border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="man">Man</option>
                                <option value="Woman">Woman</option>
                                <option value="child">Child</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Sizes
                            </label>
                            <div className="flex gap-2 mb-3">
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
                                    className="flex-1 px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white"
                                    style={{ backgroundColor: inputBg, color: textTheme }}
                                    placeholder="E.g. S (then press Enter)"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newSize.trim() && !products.sizes?.includes(newSize.trim())) {
                                            setProducts({ ...products, sizes: [...(products.sizes || []), newSize.trim()] });
                                            setNewSize('');
                                        }
                                    }}
                                    className="px-4 py-3 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-semibold hover:bg-[#333333] dark:hover:bg-[#e5e5e5] transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {products.sizes?.map((size, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full text-sm font-medium">
                                        {size}
                                        <button
                                            type="button"
                                            onClick={() => setProducts({ ...products, sizes: products.sizes.filter((_, i) => i !== index) })}
                                            className="text-lg font-bold hover:opacity-70 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Colors
                            </label>
                            <div className="flex gap-2 mb-3">
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
                                    className="flex-1 px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white"
                                    style={{ backgroundColor: inputBg, color: textTheme }}
                                    placeholder="E.g. Red (then press Enter)"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newColor.trim() && !products.colors?.includes(newColor.trim())) {
                                            setProducts({ ...products, colors: [...(products.colors || []), newColor.trim()] });
                                            setNewColor('');
                                        }
                                    }}
                                    className="px-4 py-3 bg-[#111111] dark:bg-white text-white dark:text-[#111111] font-semibold hover:bg-[#333333] dark:hover:bg-[#e5e5e5] transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {products.colors?.map((color, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full text-sm font-medium">
                                        {color}
                                        <button
                                            type="button"
                                            onClick={() => setProducts({ ...products, colors: products.colors.filter((_, i) => i !== index) })}
                                            className="text-lg font-bold hover:opacity-70 transition-opacity"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                            Product Images *
                        </label>
                        <div className="space-y-3">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                        className="flex-1 px-4 py-3 rounded-none border focus:outline-none border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white"
                                        style={{ backgroundColor: inputBg, color: textTheme }}
                                        placeholder="Paste image URL (https://...)"
                                    />
                                    {imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageUrl(index)}
                                            className="p-3 text-[#757575] hover:text-[#111111] dark:hover:text-white transition-colors"
                                        >
                                            ?
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.imageUrl && <p className="mt-1 text-sm text-[#9E3500]">{errors.imageUrl}</p>}
                        
                        {imageUrls.length < 5 && (
                            <button
                                type="button"
                                onClick={addImageUrlInput}
                                className="mt-3 text-sm font-semibold uppercase tracking-wider underline hover:opacity-70 transition-opacity"
                                style={{ color: textTheme }}
                            >
                                + Add another image
                            </button>
                        )}
                        <p className="text-xs mt-2" style={{ color: labelColor }}>
                            First image acts as the main thumbnail.
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                            Description *
                        </label>
                        <textarea
                            rows="4"
                            value={products.description || ''}
                            onChange={(e) => setProducts({ ...products, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white resize-y"
                            style={{ backgroundColor: inputBg, color: textTheme }}
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-[#9E3500]">{errors.description}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#333333]">
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-4 border border-[#E5E5E5] dark:border-[#333333] rounded-full font-medium text-[15px] hover:bg-[#111111] hover:text-white dark:hover:bg-[#222222] dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProduct}
                                disabled={isSubmitting}
                                className="flex-1 py-4 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full font-medium text-[15px] hover:bg-[#333333] dark:hover:bg-[#e5e5e5] hover:text-white dark:hover:text-[#111111] disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
