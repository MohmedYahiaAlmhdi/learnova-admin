import apiClient from './axios';
import type { Agent, Transaction, PaginatedResponse, PaginationParams } from '@/shared/types';

export const agentsApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Agent>>('/agents', { params }),

  getById: (id: string) =>
    apiClient.get<Agent>(`/agents/${id}`),

  getTransactions: (id: string, params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<Transaction>>(`/agents/${id}/transactions`, { params }),

  recharge: (id: string, amount: number) =>
    apiClient.post(`/agents/${id}/recharge`, { amount }),

  suspend: (id: string) =>
    apiClient.post(`/agents/${id}/suspend`),

  activate: (id: string) =>
    apiClient.post(`/agents/${id}/activate`),
};
