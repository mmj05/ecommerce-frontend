import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  categories: [],
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

export const fetchAllCategories = createAsyncThunk(
  'products/fetchCategories',
  async ({ pageNumber, pageSize, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      return await productService.getAllCategories(pageNumber, pageSize, sortBy, sortOrder);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
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

      // Fetch all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.content;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;