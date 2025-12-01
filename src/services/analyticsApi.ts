import axios from "axios";

const API_URL = "https://app.spentiva.com/api";

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

export const analyticsApi = {
  getSummary: async (filter?: string, customStart?: string, customEnd?: string, categoryId?: string, trackerId?: string) => {
    const params: any = {};
    if (filter) params.filter = filter;
    if (customStart) params.customStart = customStart;
    if (customEnd) params.customEnd = customEnd;
    if (categoryId) params.categoryId = categoryId;
    if (trackerId) params.trackerId = trackerId;

    const response = await axios.get(`${API_URL}/analytics/summary`, { params });
    return response.data;
  },

  getByCategory: async (filter?: string, customStart?: string, customEnd?: string, trackerId?: string) => {
    const params: any = {};
    if (filter) params.filter = filter;
    if (customStart) params.customStart = customStart;
    if (customEnd) params.customEnd = customEnd;
    if (trackerId) params.trackerId = trackerId;

    const response = await axios.get(`${API_URL}/analytics/by-category`, { params });
    return response.data;
  },

  getByMonth: async (year?: number, trackerId?: string) => {
    const params: any = {};
    if (year) params.year = year;
    if (trackerId) params.trackerId = trackerId;
    const response = await axios.get(`${API_URL}/analytics/by-month`, { params });
    return response.data;
  },

  getTotalAllTime: async (trackerId?: string) => {
    const params = trackerId ? { trackerId } : {};
    const response = await axios.get(`${API_URL}/analytics/total`, { params });
    return response.data;
  },
};
