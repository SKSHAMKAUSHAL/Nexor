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
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch {
            // Ignore storage errors (private mode/quota).
        }
    }
    
    // Persist wishlist to localStorage
    if (action.type?.startsWith('wishlist/')) {
        const wishlist = store.getState().wishlist;
        try {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        } catch {
            // Ignore storage errors (private mode/quota).
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