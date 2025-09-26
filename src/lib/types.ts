// Response wrapper for consistent API responses
export interface ResponseDTO<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: string[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  products?: Product[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrls: string[];
  stlFileUrl: string | null;
  cadFileUrl: string | null;
  printTimeHours: number | null;
  materialType: string;
  inStock: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDTO {
  id?: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  imageUrls: string[];
  stlFileUrl?: string;
  cadFileUrl?: string;
  printTimeHours?: number;
  materialType: string;
  inStock: boolean;
  featured: boolean;
}

export interface ContactFormDTO {
  name: string;
  email: string;
  message: string;
  projectType: string;
  timeline: string;
  fileId?: number;
}

export interface FileMetadata {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: number;
  uploadDate: string;
  entityType: 'PRODUCT' | 'CATEGORY';
  entityId: number;
}

// Search and filter interfaces
export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}