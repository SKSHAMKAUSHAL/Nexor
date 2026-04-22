import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myContext from '../../../context/data/myContext';
import { FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

function AddProduct() {
    const context = useContext(myContext);
    const { products, setProducts, addProduct, mode, product, loading } = context;
    const navigate = useNavigate();
    
    // Category mapping by type
    const categoryByType = {
        man: ['T-Shirts', 'Shirts', 'Hoodies & Sweatshirts', 'Jackets & Vests', 'Shorts', 'Pants & Trousers', 'Tracksuits', 'Innerwear', 'Socks', 'Swimwear', 'Jerseys', 'Compression Wear', 'Other'],
        Woman: ['T-Shirts & Tops', 'Sports Bras', 'Hoodies & Sweatshirts', 'Jackets', 'Leggings & Tights', 'Shorts', 'Skirts & Dresses', 'Tracksuits', 'Pants & Joggers', 'Innerwear', 'Swimwear', 'Other'],
        child: ['T-Shirts', 'Hoodies', 'Jackets', 'Shorts', 'Pants', 'Tracksuits', 'School Shoes', 'Socks', 'Other'],
        other: ['Other']
    };
    
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrls, setImageUrls] = useState(['']);
    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');

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

    const isValidUrl = (string) => {
        if (!string || typeof string !== 'string') return false;
        if (!/^https?:\/\//i.test(string)) return false;
        try { new URL(string); return true; } catch { return false; }
    };

    const validateFields = () => {
        setGlobalError("");
        const newErrors = {};
        if (!products.title || products.title.trim() === '') newErrors.title = 'Product title is required';
        if (!products.price || products.price.trim() === '') newErrors.price = 'Price is required';
        else if (isNaN(products.price) || parseFloat(products.price) <= 0) newErrors.price = 'Please enter a valid price';
        
        if (products.salePrice && (isNaN(products.salePrice) || parseFloat(products.salePrice) < 0 || parseFloat(products.salePrice) >= parseFloat(products.price))) {
             newErrors.salePrice = 'Sale price must be valid and less than original price';
        }

        const validUrls = imageUrls.filter(url => url.trim() !== '' && isValidUrl(url));
        if (validUrls.length === 0) newErrors.imageUrl = 'At least one valid image URL is required';
        
        if (!products.category || products.category.trim() === '') newErrors.category = 'Category is required';
        if (!products.description || products.description.trim() === '') newErrors.description = 'Description is required';
        else if (products.description.trim().length < 10) newErrors.description = 'Description should be at least 10 characters';
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            setGlobalError("Please fix the specific field errors highlighted in red matching above.");
            toast.error('Please fix the errors in the form before submitting.', {
                position: "top-center",
                autoClose: 10000,
            });
            return false;
        }
        return true;
    };

    const checkDuplicateProduct = () => {
        const isDuplicate = product.find(p => 
            p?.title?.toLowerCase().trim() === products?.title?.toLowerCase().trim() &&
            p?.category?.toLowerCase().trim() === products?.category?.toLowerCase().trim()
        );
        if (isDuplicate) {
            setGlobalError("A product with this title and category already exists. Try changing the title.");
            toast.error('Product already exists with this title and category!', {
                position: "top-center",
                autoClose: 10000,
            });
            return true;
        }
        return false;
    };

    const handleAddProduct = async (e) => {
        if(e) e.preventDefault(); // Prevents any weird browser submittions
        if (!validateFields()) return;
        if (checkDuplicateProduct()) return;

        setIsSubmitting(true);
        setGlobalError("");
        const success = await addProduct();
        setIsSubmitting(false);
        
        if (success) {
            // myState.jsx already resets the product data! But we reset images and errors here.
            setImageUrls(['']);
            setErrors({});
            navigate('/dashboard'); // Optionally navigate back to dashboard automatically 
        } else {
            setGlobalError("Failed to add product to database. Check console or make sure all fields are valid.");
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
                        Add Product
                    </h1>
                    <p className="text-[15px] mt-2" style={{ color: labelColor }}>
                        Create a new product listing in your catalog
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Product Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={products.title || ''}
                                onChange={(e) => setProducts({ ...products, title: e.target.value })}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                                placeholder="E.g. NexorAir Force 1"
                            />
                            {errors.title && <p className="mt-1 text-sm text-[#9E3500]">{errors.title}</p>}
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Price (₹) *
                            </label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                value={products.price || ''}
                                onChange={(e) => setProducts({ ...products, price: e.target.value })}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white font-oswald"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                                placeholder="0.00"
                            />
                            {errors.price && <p className="mt-1 text-sm text-[#9E3500]">{errors.price}</p>}
                        </div>

                        <div>
                            <label htmlFor="salePrice" className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Sale Price (₹) (Optional)
                            </label>
                            <input
                                id="salePrice"
                                name="salePrice"
                                type="number"
                                value={products.salePrice || ''}
                                onChange={(e) => setProducts({ ...products, salePrice: e.target.value })}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white font-oswald"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                                placeholder="0.00"
                            />
                            {errors.salePrice && <p className="mt-1 text-sm text-[#9E3500]">{errors.salePrice}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Category *
                            </label>
                            <select
                                id="category"
                                name="category"
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
                            <label htmlFor="type" className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                                Product Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={products.type || ''}
                                onChange={(e) => setTypeAndResetVariations(e.target.value)}
                                className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors appearance-none border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white"
                                style={{ backgroundColor: inputBg, color: textTheme }}
                            >
                                <option value="" disabled>Select Type (Optional)</option>
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
                                            �
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
                                            �
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label htmlFor="imageUrl-0" className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                            Product Images *
                        </label>
                        <div className="space-y-3">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        id={`imageUrl-${index}`}
                                        name={`imageUrl-${index}`}
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
                            First image will be used as the main product thumbnail.
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: labelColor }}>
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={products.description || ''}
                            onChange={(e) => setProducts({ ...products, description: e.target.value })}
                            className="w-full px-4 py-3 rounded-none border focus:outline-none transition-colors border-[#E5E5E5] focus:border-[#111111] dark:border-[#333333] dark:focus:border-white resize-y"
                            style={{ backgroundColor: inputBg, color: textTheme }}
                            placeholder="Enter detailed product description..."
                        ></textarea>
                        {errors.description && <p className="mt-1 text-sm text-[#9E3500]">{errors.description}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-[#E5E5E5] dark:border-[#333333]">
                        {globalError && (
                            <div className="mb-4 p-4 bg-[#FEE2E2] border border-[#DC2626] rounded-md flex items-start gap-3">
                                <FaExclamationCircle className="text-[#DC2626] mt-0.5 shrink-0" size={18} />
                                <p className="text-[#991B1B] text-sm font-medium">{globalError}</p>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-4 border border-[#E5E5E5] dark:border-[#333333] rounded-full font-medium text-[15px] hover:bg-[#111111] hover:text-white dark:hover:bg-[#222222] dark:hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddProduct}
                                disabled={isSubmitting || loading}
                                className="flex-1 py-4 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full font-medium text-[15px] hover:bg-[#333333] dark:hover:bg-[#e5e5e5] hover:text-white dark:hover:text-[#111111] disabled:opacity-50 transition-colors"
                            >
                                {isSubmitting || loading ? 'Adding...' : 'Add Product'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddProduct;
