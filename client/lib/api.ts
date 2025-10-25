import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
}

export interface Document {
  _id: string;
  title: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isArchived: boolean;
  isPublished: boolean;
  parentDocument?: string;
  userId: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  documents?: Document[];
  document?: Document;
  user?: User;
}

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
    });

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      if (this.token) {
        this.setAuthToken(this.token);
      }
    }

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token: string) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearAuthToken() {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Auth methods
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/api/auth/register', userData);
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.client.post('/api/auth/login', credentials);
    if (response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<{ user: User }> = await this.client.get('/api/auth/me');
    return response.data.user;
  }

  logout() {
    this.clearAuthToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Document methods
  async createDocument(data: { title: string; parentDocument?: string }): Promise<Document> {
    const response: AxiosResponse<ApiResponse<Document>> = await this.client.post('/api/documents', data);
    return response.data.document!;
  }

  async getDocuments(parentDocument?: string): Promise<Document[]> {
    const params = parentDocument ? { parentDocument } : {};
    const response: AxiosResponse<ApiResponse<Document[]>> = await this.client.get('/api/documents', { params });
    return response.data.documents || [];
  }

  async getDocumentById(documentId: string): Promise<Document> {
    const response: AxiosResponse<ApiResponse<Document>> = await this.client.get(`/api/documents/${documentId}`);
    return response.data.document!;
  }

  async updateDocument(documentId: string, data: Partial<Document>): Promise<Document> {
    const response: AxiosResponse<ApiResponse<Document>> = await this.client.patch(`/api/documents/${documentId}`, data);
    return response.data.document!;
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.client.delete(`/api/documents/${documentId}`);
  }

  async archiveDocument(documentId: string): Promise<void> {
    await this.client.patch(`/api/documents/${documentId}/archive`);
  }

  async restoreDocument(documentId: string): Promise<void> {
    await this.client.patch(`/api/documents/${documentId}/restore`);
  }

  async getTrash(): Promise<Document[]> {
    const response: AxiosResponse<ApiResponse<Document[]>> = await this.client.get('/api/documents/trash');
    return response.data.documents || [];
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const response: AxiosResponse<ApiResponse<Document[]>> = await this.client.get('/api/documents/search', {
      params: { q: query }
    });
    return response.data.documents || [];
  }

  // File upload methods
  async uploadFile(file: File): Promise<{ url: string; filename: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse<ApiResponse<{ url: string; filename: string; size: number }>> = 
      await this.client.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

    return response.data.data!;
  }

  async deleteFile(url: string): Promise<void> {
    await this.client.delete('/api/files/delete', { data: { url } });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
