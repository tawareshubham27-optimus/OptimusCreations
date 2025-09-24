import axios from 'axios';
import {
  Product,
  Category,
  ProductDTO,
  ContactFormDTO,
  FileMetadata,
  ResponseDTO,
  ProductSearchParams
} from './types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Add response interceptor to handle the ResponseDTO wrapper
api.interceptors.response.use(
  (response) => {
    // If the response is already in the ResponseDTO format, return as is
    if (response.data.status && response.data.message) {
      return response;
    }
    // Wrap the response in ResponseDTO format
    return {
      ...response,
      data: {
        status: 'success',
        message: 'Operation successful',
        data: response.data,
      },
    };
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config
    });
    return Promise.reject({
      status: 'error',
      message: error.response?.data?.message || 'An error occurred',
      errors: error.response?.data?.errors,
      statusCode: error.response?.status
    });
  }
);

// Product related API calls
export const productApi = {
  getAllProducts: () => 
    api.get<ResponseDTO<Product[]>>('/products'),
  
  getProductById: (id: number) => 
    api.get<ResponseDTO<Product>>(`/products/${id}`),
  
  getFeaturedProducts: () => 
    api.get<ResponseDTO<Product[]>>('/products/featured'),
  
  searchProducts: (params: ProductSearchParams) =>
    api.get<ResponseDTO<{
      content: Product[];
      totalElements: number;
      totalPages: number;
      currentPage: number;
      size: number;
    }>>('/products/search', { params }),
  
  getProductsByCategory: (categoryId: number) =>
    api.get<ResponseDTO<Product[]>>(`/products/category/${categoryId}`),
  
  createProduct: (product: ProductDTO) => 
    api.post<ResponseDTO<Product>>('/products', product),
  
  updateProduct: (id: number, product: Partial<ProductDTO>) =>
    api.put<ResponseDTO<Product>>(`/products/${id}`, product),
  
  deleteProduct: (id: number) => 
    api.delete<ResponseDTO<void>>(`/products/${id}`),
  
  toggleFeatured: (id: number) =>
    api.patch<ResponseDTO<Product>>(`/products/${id}/featured`),
  
  updateStock: (id: number, inStock: boolean) =>
    api.patch<ResponseDTO<Product>>(`/products/${id}/stock`, { inStock }),
};

// Category related API calls
export const categoryApi = {
  getAllCategories: () => 
    api.get<ResponseDTO<Category[]>>('/categories'),
  
  getCategoryById: (id: number) => 
    api.get<ResponseDTO<Category>>(`/categories/${id}`),
  
  getCategoryByName: (name: string) => 
    api.get<ResponseDTO<Category>>(`/categories/name/${name}`),
  
  createCategory: (category: Omit<Category, 'id' | 'createdAt'>) => 
    api.post<ResponseDTO<Category>>('/categories', category),
  
  updateCategory: (id: number, category: Partial<Category>) =>
    api.put<ResponseDTO<Category>>(`/categories/${id}`, category),
  
  deleteCategory: (id: number) => 
    api.delete<ResponseDTO<void>>(`/categories/${id}`),
};

// Contact form API calls
export const contactApi = {
  submitContactForm: (formData: ContactFormDTO) => 
    api.post<ResponseDTO<void>>('/contact', formData),
};

// File upload API calls
export const fileApi = {
  uploadFile: (file: File, type: 'image' | 'stl' | 'cad', entityType?: 'PRODUCT' | 'CATEGORY', entityId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (entityType && entityId) {
      formData.append('entityType', entityType);
      formData.append('entityId', entityId.toString());
    }
    return api.post<ResponseDTO<FileMetadata>>(`/upload/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteFile: (fileId: number) =>
    api.delete<ResponseDTO<void>>(`/upload/${fileId}`),
    
  getFileMetadata: (fileId: number) =>
    api.get<ResponseDTO<FileMetadata>>(`/upload/${fileId}`),
};

export default api;