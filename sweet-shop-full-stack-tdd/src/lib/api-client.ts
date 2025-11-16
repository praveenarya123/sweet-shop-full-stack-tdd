"use client";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface Sweet {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiClient {
  private baseUrl = '/api';
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.setToken(response.token);
    return response;
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Sweets endpoints
  async getSweets(search?: string, category?: string): Promise<{ sweets: Sweet[] }> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const query = params.toString();
    return this.request<{ sweets: Sweet[] }>(`/sweets${query ? `?${query}` : ''}`);
  }

  async getSweet(id: number): Promise<{ sweet: Sweet }> {
    return this.request<{ sweet: Sweet }>(`/sweets/${id}`);
  }

  async createSweet(data: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>): Promise<{ sweet: Sweet }> {
    return this.request<{ sweet: Sweet }>('/sweets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSweet(id: number, data: Partial<Sweet>): Promise<{ sweet: Sweet }> {
    return this.request<{ sweet: Sweet }>(`/sweets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSweet(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/sweets/${id}`, {
      method: 'DELETE',
    });
  }

  async purchaseSweet(id: number, quantity: number): Promise<{ sweet: Sweet; message: string }> {
    return this.request<{ sweet: Sweet; message: string }>(`/sweets/${id}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async restockSweet(id: number, quantity: number): Promise<{ sweet: Sweet; message: string }> {
    return this.request<{ sweet: Sweet; message: string }>(`/sweets/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }
}

export const apiClient = new ApiClient();
