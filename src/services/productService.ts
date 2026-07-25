import API from './api';
import type { Product } from '../types/product';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  stockStatus?: 'inStock' | 'lowStock' | 'outOfStock' | string;
  featured?: boolean | string;
  sortBy?: string;
  q?: string;
  search?: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  totalProducts: number;
  page: number;
  totalPages: number;
  data: Product[];
}

export interface ProductDetailResponse {
  success: boolean;
  stockValidation?: {
    inStock: boolean;
    stockCount: number;
  };
  data: Product;
}

export const productService = {
  /**
   * Fetch paginated/filtered/sorted products from MongoDB API
   */
  getProducts: async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
    const response = await API.get<ProductsResponse>('/products', { params });
    return response.data;
  },

  /**
   * Fetch single product detail by ID or SKU
   */
  getProductById: async (id: string): Promise<ProductDetailResponse> => {
    const response = await API.get<ProductDetailResponse>(`/products/${id}`);
    return response.data;
  },

  /**
   * Fetch featured/bestseller products
   */
  getFeaturedProducts: async (): Promise<{ success: boolean; count: number; data: Product[] }> => {
    const response = await API.get('/products/featured');
    return response.data;
  },

  /**
   * Keyword search products
   */
  searchProducts: async (query: string) => {
    const response = await API.get('/products', {
      params: {
        search: query
      }
    });

    return response.data;
  },

  /**
   * Fetch products by category name
   */
  getProductsByCategory: async (
    category: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<ProductsResponse> => {
    const response = await API.get<ProductsResponse>(`/products/category/${encodeURIComponent(category)}`, {
      params,
    });
    return response.data;
  },

  /**
   * Admin: Create new product
   */
  createProduct: async (productData: Partial<Product>): Promise<{ success: boolean; message?: string; data: Product }> => {
    const response = await API.post('/products', productData);
    return response.data;
  },

  /**
   * Admin: Update product
   */
  updateProduct: async (id: string, productData: Partial<Product>): Promise<{ success: boolean; message?: string; data: Product }> => {
    const response = await API.put(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Admin: Delete product
   */
  deleteProduct: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Admin: Update stock count
   */
  updateStock: async (id: string, stock: number): Promise<{ success: boolean; message?: string; data: Product }> => {
    const response = await API.patch(`/products/${id}/stock`, { stock });
    return response.data;
  },

  /**
   * Admin: Toggle featured status
   */
  toggleFeatured: async (id: string): Promise<{ success: boolean; message?: string; data: Product }> => {
    const response = await API.patch(`/products/${id}/featured`);
    return response.data;
  },
};

export default productService;
