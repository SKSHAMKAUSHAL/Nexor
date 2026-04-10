import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
    try {
        const raw = localStorage.getItem('cart');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            localStorage.removeItem('cart');
            return [];
        }
        // Validate cart items have required fields
        return parsed.filter(item => item && item.id && item.title && item.price !== undefined);
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
        return [];
    }
};

const initialState = getInitialCart();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers : {
        addToCart(state, action){
            // Consider selectedVariation when identifying unique cart entries
            const payload = action.payload || {};
            
            // Validate required fields
            if (!payload.id || !payload.title || payload.price === undefined) {
                console.warn('Invalid product data for cart:', payload);
                return;
            }
            
            const existingItem = state.find(item => (
                item.id === payload.id && ((item.selectedVariation || '') === (payload.selectedVariation || ''))
            ));
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                const newItem = {
                    ...payload,
                    quantity: 1,
                    // Ensure these fields exist
                    title: payload.title || 'Unknown Product',
                    price: payload.price || 0,
                    imageUrl: payload.imageUrl || '',
                    description: payload.description || ''
                };
                state.push(newItem);
            }
        },
        deleteFromCart(state, action){
            const payload = action.payload || {};
            return state.filter(item => !(item.id === payload.id && ((item.selectedVariation || '') === (payload.selectedVariation || ''))));
        },
        increMantQuantity(state, action){
            const payload = action.payload || {};
            const item = state.find(item => (item.id === payload.id && ((item.selectedVariation || '') === (payload.selectedVariation || ''))));
            if (item) {
                item.quantity = (item.quantity || 1) + 1;
            }
        },
        decreMantQuantity(state, action){
            const payload = action.payload || {};
            const item = state.find(item => (item.id === payload.id && ((item.selectedVariation || '') === (payload.selectedVariation || ''))));
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },
        clearCart(){
            return [];
        }
    }
})

export const {addToCart, deleteFromCart, increMantQuantity, decreMantQuantity, clearCart} = cartSlice.actions;

export default cartSlice.reducer;