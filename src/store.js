import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import cartReducer from './features/cart/cartSlice';
import productReducer from './features/products/productSlice';
import addressReducer from './features/address/addressSlice';
import orderReducer from './features/orders/orderSlice';
import categoryReducer from './features/categories/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    address: addressReducer,
    order: orderReducer,
    categories: categoryReducer
  },
});