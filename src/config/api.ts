import axios from 'axios';
import { ParsedExpense, Expense } from '../types';

// Authentication Response Types
export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profilePhoto?: string;
  accountType: 'personal' | 'business';
  role?: 'user' | 'business' | 'individual';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface OtpResponse {
  success: boolean;
  message: string;
  devOtp?: string;
}

export interface ErrorResponse {
  success: boolean;
  error: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface PhotoUploadResponse {
  success: boolean;
  message: string;
  data: {
    profilePhoto: string;
  };
  photoUrl?: string;
}

// Environment-aware API URL
const getApiUrl = () => {
  if (import.meta.env.MODE === 'development') {
    return 'http://localhost:8002';
  }
  return 'https://api.spentiva.com';
};

export const API_URL = getApiUrl();
export const API_BASE = getApiUrl().replace('/api', ''); // For file URLs like profile photos

// Configure axios instance with base URL and interceptors
export const apiClient = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// All endpoint URLs organized by domain
export const endpoints = {
  auth: {
    // OTP-based authentication (existing)
    sendOtp: `${API_URL}/auth/send-otp`,
    verifyOtp: `${API_URL}/auth/verify-otp`,

    // Email/Password authentication (from Swagger)
    login: `${API_URL}/auth/login`,
    signup: `${API_URL}/auth/signup`,

    // User profile
    me: `${API_URL}/auth/me`,
    profile: `${API_URL}/auth/profile`,
    profilePhoto: `${API_URL}/auth/profile-photo`,

    // Email verification
    sendEmailOtp: `${API_URL}/auth/send-email-otp`,
    verifyEmailOtp: `${API_URL}/auth/verify-email-otp`,
    sendVerificationOtp: `${API_URL}/auth/send-verification-otp`,
    verifyEmail: `${API_URL}/auth/verify-email`,

    // Password management
    forgotPassword: `${API_URL}/auth/forgot-password`,
    resetPassword: `${API_URL}/auth/reset-password`,
  },
  expenses: {
    base: `${API_URL}/expenses`,
    byId: (id: string) => `${API_URL}/expenses/${id}`,
    parse: `${API_URL}/parse-expense`,
  },
  categories: {
    base: `${API_URL}/categories`,
  },
  trackers: {
    base: `${API_URL}/trackers`,
    byId: (id: string) => `${API_URL}/trackers/${id}`,
    categories: (trackerId: string) => `${API_URL}/trackers/${trackerId}/categories`,
    category: (trackerId: string, categoryId: string) => `${API_URL}/trackers/${trackerId}/categories/${categoryId}`,
  },
  analytics: {
    summary: `${API_URL}/analytics/summary`,
    byCategory: `${API_URL}/analytics/by-category`,
    byMonth: `${API_URL}/analytics/by-month`,
    total: `${API_URL}/analytics/total`,
  },
  usage: {
    overall: `${API_URL}/usage/overall`,
    tracker: (trackerId: string) => `${API_URL}/usage/tracker/${trackerId}`,
    logs: (trackerId: string) => `${API_URL}/usage/tracker/${trackerId}/logs`,
  },
};

// Analytics API types
export interface AnalyticsSummary {
  total: number;
  average: number;
  count: number;
}

export interface CategoryAnalytics {
  category: string;
  categoryId: string;
  total: number;
  count: number;
}

export interface MonthlyAnalytics {
  month: number;
  total: number;
  count: number;
}

// All API functions organized by domain
export const api = {
  // Authentication APIs
  auth: {
    // OTP-based authentication (existing - email based)
    sendOtp: async (email: string, isSignup: boolean = false): Promise<OtpResponse> => {
      const response = await apiClient.post(endpoints.auth.sendOtp, { email, isSignup });
      return response.data;
    },

    verifyOtp: async (email: string, otp: string, name?: string, accountType?: string): Promise<AuthResponse> => {
      const response = await apiClient.post(endpoints.auth.verifyOtp, { email, otp, name, accountType });
      return response.data;
    },

    // Email/Password authentication
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const response = await apiClient.post('/v1/api/login', { email, password });
      // Transform the response to match AuthResponse interface
      return {
        success: response.data.status === 'success',
        token: response.data.data.token,
        user: response.data.data.user,
        message: response.data.message,
      };
    },

    signup: async (data: { name: string; email: string; password: string; role?: 'user' | 'business' | 'individual' }): Promise<AuthResponse> => {
      const response = await apiClient.post('/v1/api/signup', data);
      return {
        success: response.data.status === 'success',
        token: response.data.data.token,
        user: response.data.data.user,
        message: response.data.message,
      };
    },

    // User profile
    getCurrentUser: async (token: string): Promise<{ user: User }> => {
      const response = await axios.get(endpoints.auth.me, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },

    updateProfile: async (data: { name?: string; email?: string; phone?: string; accountType?: 'personal' | 'business' }, token: string): Promise<ProfileUpdateResponse> => {
      const response = await axios.put(endpoints.auth.profile, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },

    uploadProfilePhoto: async (photoFile: File, token: string): Promise<PhotoUploadResponse> => {
      const formData = new FormData();
      formData.append('photo', photoFile);

      const response = await axios.post(endpoints.auth.profilePhoto, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },

    // Email verification (profile)
    sendEmailOtp: async (email: string, token: string): Promise<OtpResponse> => {
      const response = await axios.post(endpoints.auth.sendEmailOtp, { email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },

    verifyEmailOtp: async (email: string, otp: string, token: string): Promise<ProfileUpdateResponse> => {
      const response = await axios.post(endpoints.auth.verifyEmailOtp, { email, otp }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },

    // Email verification (standalone)
    sendVerificationOtp: async (email: string): Promise<OtpResponse> => {
      const response = await apiClient.post(endpoints.auth.sendVerificationOtp, { email });
      return response.data;
    },

    verifyEmail: async (email: string, otp: string): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.post(endpoints.auth.verifyEmail, { email, otp });
      return response.data;
    },

    // Password management
    forgotPassword: async (email: string): Promise<OtpResponse> => {
      const response = await apiClient.post(endpoints.auth.forgotPassword, { email });
      return response.data;
    },

    resetPassword: async (data: { email: string; otp: string; newPassword: string; confirmPassword: string }): Promise<{ success: boolean; message: string }> => {
      const response = await apiClient.post(endpoints.auth.resetPassword, data);
      return response.data;
    },
  },

  // Expenses APIs
  expenses: {
    parse: async (message: string, trackerId?: string): Promise<ParsedExpense | { error: string }> => {
      const response = await apiClient.post(endpoints.expenses.parse, { message, trackerId });
      return response.data;
    },

    create: async (expense: ParsedExpense): Promise<Expense> => {
      const response = await apiClient.post(endpoints.expenses.base, expense);
      return response.data.expense;
    },

    getAll: async (trackerId?: string): Promise<Expense[]> => {
      const url = trackerId ? `${endpoints.expenses.base}?trackerId=${trackerId}` : endpoints.expenses.base;
      const response = await apiClient.get(url);
      return response.data.expenses;
    },

    update: async (id: string, expense: Partial<ParsedExpense>): Promise<Expense> => {
      const response = await apiClient.put(endpoints.expenses.byId(id), expense);
      return response.data.expense;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(endpoints.expenses.byId(id));
    },
  },

  // Categories APIs
  categories: {
    getAll: async () => {
      const response = await apiClient.get(endpoints.categories.base);
      return response.data;
    },
  },

  // Trackers APIs
  trackers: {
    getAll: async (): Promise<any[]> => {
      const response = await apiClient.get(endpoints.trackers.base);
      return response.data.trackers;
    },

    getOne: async (id: string): Promise<any> => {
      const response = await apiClient.get(endpoints.trackers.byId(id));
      return response.data.tracker;
    },

    create: async (tracker: any): Promise<any> => {
      const response = await apiClient.post(endpoints.trackers.base, tracker);
      return response.data.tracker;
    },

    update: async (id: string, tracker: any): Promise<any> => {
      const response = await apiClient.put(endpoints.trackers.byId(id), tracker);
      return response.data.tracker;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(endpoints.trackers.byId(id));
    },

    // Tracker Categories
    getCategories: async (trackerId: string): Promise<any[]> => {
      const response = await apiClient.get(endpoints.trackers.categories(trackerId));
      return response.data.categories;
    },

    createCategory: async (trackerId: string, category: any): Promise<any> => {
      const response = await apiClient.post(endpoints.trackers.categories(trackerId), category);
      return response.data.category;
    },

    updateCategory: async (trackerId: string, categoryId: string, category: any): Promise<any> => {
      const response = await apiClient.put(endpoints.trackers.category(trackerId, categoryId), category);
      return response.data.category;
    },

    deleteCategory: async (trackerId: string, categoryId: string): Promise<void> => {
      await apiClient.delete(endpoints.trackers.category(trackerId, categoryId));
    },
  },

  // Analytics APIs
  analytics: {
    getSummary: async (filter?: string, customStart?: string, customEnd?: string, categoryId?: string, trackerId?: string) => {
      const params: any = {};
      if (filter) params.filter = filter;
      if (customStart) params.customStart = customStart;
      if (customEnd) params.customEnd = customEnd;
      if (categoryId) params.categoryId = categoryId;
      if (trackerId) params.trackerId = trackerId;

      const response = await apiClient.get(endpoints.analytics.summary, { params });
      return response.data;
    },

    getByCategory: async (filter?: string, customStart?: string, customEnd?: string, trackerId?: string) => {
      const params: any = {};
      if (filter) params.filter = filter;
      if (customStart) params.customStart = customStart;
      if (customEnd) params.customEnd = customEnd;
      if (trackerId) params.trackerId = trackerId;

      const response = await apiClient.get(endpoints.analytics.byCategory, { params });
      return response.data;
    },

    getByMonth: async (year?: number, trackerId?: string) => {
      const params: any = {};
      if (year) params.year = year;
      if (trackerId) params.trackerId = trackerId;
      const response = await apiClient.get(endpoints.analytics.byMonth, { params });
      return response.data;
    },

    getTotalAllTime: async (trackerId?: string) => {
      const params = trackerId ? { trackerId } : {};
      const response = await apiClient.get(endpoints.analytics.total, { params });
      return response.data;
    },
  },

  // Usage APIs
  usage: {
    getOverall: async (): Promise<any> => {
      const response = await apiClient.get(endpoints.usage.overall);
      return response.data;
    },

    getTracker: async (trackerId: string): Promise<any> => {
      const response = await apiClient.get(endpoints.usage.tracker(trackerId));
      return response.data;
    },

    getLogs: async (trackerId: string, limit = 100, offset = 0): Promise<any> => {
      const response = await apiClient.get(endpoints.usage.logs(trackerId), {
        params: { limit, offset },
      });
      return response.data;
    },
  },
};
