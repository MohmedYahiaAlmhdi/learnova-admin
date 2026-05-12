import apiClient from './axios';
import type { User, PaginatedResponse, PaginationParams } from '@/shared/types';

export const usersApi = {
  getAll: (params?: PaginationParams & { role?: string; status?: string }) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params }),

  getById: (id: string) =>
    apiClient.get<User>(`/users/${id}`),

  update: (id: string, data: Partial<Pick<User, 'name' | 'email' | 'role' | 'status' | 'phone' | 'country'>>) =>
    apiClient.put<User>(`/users/${id}`, data),

  suspend: (id: string, reason: string) =>
    apiClient.post(`/users/${id}/suspend`, { reason }),

  activate: (id: string) =>
    apiClient.post(`/users/${id}/activate`),

  getViolations: (id: string) =>
    apiClient.get(`/users/${id}/violations`),

  changeRole: (id: string, role: string) =>
    apiClient.post(`/users/${id}/change-role`, { role }),
};
