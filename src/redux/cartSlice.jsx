import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
    try {
        const raw = localStorage.getItem('cart');
        return raw ? JSON.parse(raw) : [];
    } catch {
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
            const existingItem = state.find(item => (
                item.id === payload.id && ((item.selectedVariation || '') === (payload.selectedVariation || ''))
            ));
            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                state.push({ ...payload, quantity: 1 });
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