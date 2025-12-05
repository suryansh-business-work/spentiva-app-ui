import { postRequest, getRequest, putRequest, deleteRequest } from '../utils/http';
import { endpoints } from '../config/api';
import {
  CreateTicketPayload,
  SupportTicket,
  TicketFilters,
  TicketStats,
  UpdateStatusPayload,
  AttachmentMetadata,
  AddUpdatePayload,
} from '../types/support';

// Create support ticket
export const createSupportTicket = async (payload: CreateTicketPayload): Promise<SupportTicket> => {
  // Debug: Log auth token
  const token = localStorage.getItem('authToken');
  console.log('🔑 Auth Token:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
  console.log('📍 API Endpoint:', endpoints.support.createTicket);
  console.log('📦 Payload:', payload);

  const response = await postRequest(endpoints.support.createTicket, payload);
  console.log('✅ Response:', response.data);
  return response.data.data.ticket;
};

// Get user's tickets or all tickets (admin)
export const getUserTickets = async (
  filters?: TicketFilters
): Promise<{ tickets: SupportTicket[]; total: number }> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.skip) params.append('skip', filters.skip.toString());

  const queryString = params.toString();
  const url = queryString
    ? `${endpoints.support.getTickets}?${queryString}`
    : endpoints.support.getTickets;

  const response = await getRequest(url);
  return response.data.data;
};

// Get ticket by ID
export const getTicketById = async (ticketId: string): Promise<SupportTicket> => {
  const response = await getRequest(endpoints.support.getTicketById(ticketId));
  return response.data.data;
};

// Update ticket status
export const updateTicketStatus = async (
  ticketId: string,
  status: UpdateStatusPayload
): Promise<SupportTicket> => {
  const response = await putRequest(endpoints.support.updateStatus(ticketId), status);
  return response.data.data.ticket;
};

// Add attachment to ticket
export const addAttachmentToTicket = async (
  ticketId: string,
  attachment: AttachmentMetadata
): Promise<SupportTicket> => {
  const response = await postRequest(endpoints.support.addAttachment(ticketId), attachment);
  return response.data.data.ticket;
};

// Add update message to ticket
export const addUpdateToTicket = async (
  ticketId: string,
  update: AddUpdatePayload
): Promise<SupportTicket> => {
  const response = await postRequest(endpoints.support.addUpdate(ticketId), update);
  return response.data.data.ticket;
};

// Delete ticket (admin only)
export const deleteTicket = async (ticketId: string): Promise<string> => {
  const response = await deleteRequest(endpoints.support.deleteTicket(ticketId));
  return response.data.message;
};

// Get ticket statistics
export const getTicketStats = async (): Promise<TicketStats> => {
  const response = await getRequest(endpoints.support.getStats);
  return response.data.data;
};
