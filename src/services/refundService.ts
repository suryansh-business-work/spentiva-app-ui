import { endpoints } from '../config/api';
import { getRequest, postRequest, patchRequest, deleteRequest } from '../utils/http';
import {
  CreateRefundRequest,
  UpdateRefundStatusRequest,
  RefundQueryParams,
  RefundResponse,
  RefundsListResponse,
  RefundStatsResponse,
} from '../types/refund';

/**
 * Create a new refund
 */
export const createRefund = async (data: CreateRefundRequest): Promise<RefundResponse> => {
  const response = await postRequest(endpoints.refund.create, data);
  return response.data;
};

/**
 * Get refund by ID
 */
export const getRefundById = async (refundId: string): Promise<RefundResponse> => {
  const response = await getRequest(endpoints.refund.getById(refundId));
  return response.data;
};

/**
 * Get all refunds for a specific payment
 */
export const getRefundsByPayment = async (paymentId: string): Promise<RefundsListResponse> => {
  const response = await getRequest(endpoints.refund.getByPayment(paymentId));
  return response.data;
};

/**
 * Get all refunds for a specific user
 */
export const getUserRefunds = async (
  userId: string,
  params?: RefundQueryParams
): Promise<RefundsListResponse> => {
  const response = await getRequest(endpoints.refund.getUserRefunds(userId), params);
  return response.data;
};

/**
 * Get all refunds (Admin only)
 */
export const getAllRefunds = async (params?: RefundQueryParams): Promise<RefundsListResponse> => {
  const response = await getRequest(endpoints.refund.getAll, params);
  return response.data;
};

/**
 * Update refund status
 */
export const updateRefundStatus = async (
  refundId: string,
  data: UpdateRefundStatusRequest
): Promise<RefundResponse> => {
  const response = await patchRequest(endpoints.refund.updateStatus(refundId), data);
  return response.data;
};

/**
 * Delete refund
 */
export const deleteRefund = async (refundId: string): Promise<{ success: boolean }> => {
  const response = await deleteRequest(endpoints.refund.delete(refundId));
  return response.data;
};

/**
 * Get refund statistics
 */
export const getRefundStats = async (): Promise<RefundStatsResponse> => {
  const response = await getRequest(endpoints.refund.stats);
  return response.data;
};
