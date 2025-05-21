// src/features/products/productSlice.js - Enhanced version
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  featuredProducts: [],
  product: null, // For single product details
  isLoading: false,
  error: null,
  pagination: {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    lastPage: false
  }
};

// Async thunks
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ pageNumber, pageSize, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      return await productService.getAllProducts(pageNumber, pageSize, sortBy, sortOrder);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Fetch product details
export const fetchProductDetails = createAsyncThunk(
  'products/fetchDetails',
  async (productId, { rejectWithValue }) => {
    try {
      return await productService.getProductDetails(productId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async ({ categoryId, pageNumber, pageSize, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      return await productService.getProductsByCategory(categoryId, pageNumber, pageSize, sortBy, sortOrder);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/search',
  async ({ keyWord, pageNumber, pageSize, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      return await productService.searchProducts(keyWord, pageNumber, pageSize, sortBy, sortOrder);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);

// Create a new product
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      return await productService.createProduct(productData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      return await productService.updateProduct(productId, productData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId, { rejectWithValue }) => {
    try {
      return await productService.deleteProduct(productId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Upload product image
export const uploadProductImage = createAsyncThunk(
  'products/uploadImage',
  async ({ productId, imageFile }, { rejectWithValue }) => {
    try {
      return await productService.uploadProductImage(productId, imageFile);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload product image');
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    clearProduct: (state) => {
      state.product = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          lastPage: action.payload.lastPage
        };
        // Select first 4 products as featured (in a real app, this would be based on other criteria)
        state.featuredProducts = action.payload.content.slice(0, 4);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.product = null;
      })

      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          lastPage: action.payload.lastPage
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.content;
        state.pagination = {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          lastPage: action.payload.lastPage
        };
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = [action.payload, ...state.products];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.map(product => 
          product.productId === action.payload.productId ? action.payload : product
        );
        state.product = null; // Clear selected product after update
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(
          product => product.productId !== action.payload.productId
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Upload product image
      .addCase(uploadProductImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update product image in state
        if (state.product && state.product.productId === action.payload.productId) {
          state.product.image = action.payload.image;
        }
        // Also update in products list
        state.products = state.products.map(product => 
          product.productId === action.payload.productId 
            ? { ...product, image: action.payload.image } 
            : product
        );
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, setProduct, clearProduct } = productSlice.actions;
export default productSlice.reducer;