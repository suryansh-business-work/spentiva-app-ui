import { useState, useEffect, useCallback } from 'react';
import { endpoints } from '../../../config/api';
import { getRequest, deleteRequest } from '../../../utils/http';
import { UsageLog, UsageLogsResponse } from '../../../types/usage';

interface UseUsageLogsParams {
  trackerId?: string;
  limit?: number;
  offset?: number;
  autoFetch?: boolean;
}

interface UseUsageLogsReturn {
  logs: UsageLog[];
  totalCount: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  fetchLogs: (params?: { trackerId?: string; limit?: number; offset?: number }) => Promise<void>;
  cleanupOldLogs: (daysOld?: number) => Promise<{ success: boolean; message?: string }>;
}

/**
 * Custom hook to manage usage logs with pagination
 */
export const useUsageLogs = (params: UseUsageLogsParams = {}): UseUsageLogsReturn => {
  const { trackerId, limit = 50, offset = 0, autoFetch = true } = params;

  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(
    async (fetchParams?: { trackerId?: string; limit?: number; offset?: number }) => {
      setLoading(true);
      setError(null);

      const queryParams: Record<string, string> = {};

      const finalTrackerId = fetchParams?.trackerId || trackerId;
      const finalLimit = fetchParams?.limit || limit;
      const finalOffset = fetchParams?.offset || offset;

      if (finalTrackerId) queryParams.trackerId = finalTrackerId;
      if (finalLimit) queryParams.limit = finalLimit.toString();
      if (finalOffset) queryParams.offset = finalOffset.toString();

      try {
        const response = await getRequest(endpoints.usageLogs.getAll, queryParams);
        const data: UsageLogsResponse = response.data?.data || response.data;

        setLogs(data.logs || []);
        setTotalCount(data.totalCount || 0);
        setHasMore(data.hasMore || false);
      } catch (err: any) {
        console.error('Error fetching usage logs:', err);
        setError(err.response?.data?.error || err.message || 'Failed to load usage logs');
        setLogs([]);
      } finally {
        setLoading(false);
      }
    },
    [trackerId, limit, offset]
  );

  const cleanupOldLogs = useCallback(async (daysOld: number = 90) => {
    try {
      const response = await deleteRequest(endpoints.usageLogs.cleanup, {
        daysOld: daysOld.toString(),
      });

      return {
        success: true,
        message: response.data?.message || 'Logs cleaned up successfully',
      };
    } catch (err: any) {
      console.error('Error cleaning up logs:', err);
      return {
        success: false,
        message: err.response?.data?.error || err.message || 'Failed to cleanup logs',
      };
    }
  }, []);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    logs,
    totalCount,
    hasMore,
    loading,
    error,
    fetchLogs,
    cleanupOldLogs,
  };
};
