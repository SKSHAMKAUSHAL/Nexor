import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './cartSlice'
import wishlistSlice from './wishlistSlice'

// Middleware to sync cart and wishlist to localStorage on every state change
const localStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    
    // Persist cart to localStorage
    if (action.type?.startsWith('cart/')) {
        const cart = store.getState().cart;
        try {
            // Validate cart before storing
            if (Array.isArray(cart)) {
                const validCart = cart.filter(item => item && item.id && item.title && item.price !== undefined);
                localStorage.setItem('cart', JSON.stringify(validCart));
            }
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }
    
    // Persist wishlist to localStorage
    if (action.type?.startsWith('wishlist/')) {
        const wishlist = store.getState().wishlist;
        try {
            // Validate wishlist before storing
            if (Array.isArray(wishlist)) {
                const validWishlist = wishlist.filter(item => item && item.id);
                localStorage.setItem('wishlist', JSON.stringify(validWishlist));
            }
        } catch (error) {
            console.error('Error saving wishlist to localStorage:', error);
        }
    }
    
    return result;
};

export const store = configureStore({
    reducer: {
        cart : cartSlice,
        wishlist: wishlistSlice,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(localStorageMiddleware),
    devTools:true
})