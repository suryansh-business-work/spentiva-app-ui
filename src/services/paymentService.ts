import { endpoints } from '../config/api';
import { getRequest, postRequest, patchRequest, deleteRequest } from '../utils/http';
import {
  CreatePaymentRequest,
  UpdatePaymentStateRequest,
  PaymentQueryParams,
  PaymentResponse,
  PaymentsListResponse,
  PaymentStatsResponse,
} from '../types/payment';

/**
 * Create a new payment
 */
export const createPayment = async (data: CreatePaymentRequest): Promise<PaymentResponse> => {
  const response = await postRequest(endpoints.payment.create, data);
  return response.data;
};

/**
 * Get payment by ID
 */
export const getPaymentById = async (paymentId: string): Promise<PaymentResponse> => {
  const response = await getRequest(endpoints.payment.getById(paymentId));
  return response.data;
};

/**
 * Get all payments for a specific user
 */
export const getUserPayments = async (
  userId: string,
  params?: PaymentQueryParams
): Promise<PaymentsListResponse> => {
  const response = await getRequest(endpoints.payment.getUserPayments(userId), params);
  // Backend returns { data: { payments, count } }
  return {
    success: true,
    payments: response.data.data.payments,
    total: response.data.data.count || response.data.data.payments.length,
    page: params?.page || 1,
    limit: params?.limit || 10,
  };
};

/**
 * Get all payments (Admin only)
 */
export const getAllPayments = async (
  params?: PaymentQueryParams
): Promise<PaymentsListResponse> => {
  const response = await getRequest(endpoints.payment.getAll, params);
  // Backend returns { data: { payments, total, count } }
  return {
    success: true,
    payments: response.data.data.payments,
    total: response.data.data.total,
    page: params?.page || 1,
    limit: params?.limit || 10,
  };
};

/**
 * Update payment state
 */
export const updatePaymentState = async (
  paymentId: string,
  data: UpdatePaymentStateRequest
): Promise<PaymentResponse> => {
  const response = await patchRequest(endpoints.payment.updateState(paymentId), data);
  return response.data;
};

/**
 * Delete payment (GDPR - Right to be forgotten)
 */
export const deletePayment = async (paymentId: string): Promise<{ success: boolean }> => {
  const response = await deleteRequest(endpoints.payment.delete(paymentId));
  return response.data;
};

/**
 * Get payment statistics
 */
export const getPaymentStats = async (): Promise<PaymentStatsResponse> => {
  const response = await getRequest(endpoints.payment.stats);
  return response.data;
};

/**
 * Expire pending payments older than specified minutes
 */
export const expirePendingPayments = async (
  expiryMinutes: number = 30
): Promise<{ success: boolean; expiredCount: number }> => {
  const response = await postRequest(endpoints.payment.expirePending, { expiryMinutes });
  return response.data;
};
