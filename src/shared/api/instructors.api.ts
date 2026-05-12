import apiClient from './axios';
import type { Instructor, PaginatedResponse, PaginationParams, WithdrawalRequest } from '@/shared/types';

export const instructorsApi = {
  getAll: (params?: PaginationParams & { status?: string }) =>
    apiClient.get<PaginatedResponse<Instructor>>('/instructors', { params }),

  getById: (id: string) =>
    apiClient.get<Instructor>(`/instructors/${id}`),

  approve: (id: string) =>
    apiClient.post(`/instructors/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.post(`/instructors/${id}/reject`, { reason }),

  suspend: (id: string, reason: string) =>
    apiClient.post(`/instructors/${id}/suspend`, { reason }),

  updateCommission: (id: string, rate: number) =>
    apiClient.post(`/instructors/${id}/commission`, { rate }),

  getWithdrawalRequests: (params?: PaginationParams) =>
    apiClient.get<PaginatedResponse<WithdrawalRequest>>('/instructors/withdrawals', { params }),

  processWithdrawal: (id: string, approved: boolean) =>
    apiClient.post(`/instructors/withdrawals/${id}/process`, { approved }),
};
