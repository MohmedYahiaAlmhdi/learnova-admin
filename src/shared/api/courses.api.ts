import apiClient from './axios';
import type { Course, PaginatedResponse, PaginationParams } from '@/shared/types';

export const coursesApi = {
  getAll: (params?: PaginationParams & { status?: string; categoryId?: string }) =>
    apiClient.get<PaginatedResponse<Course>>('/courses', { params }),

  getById: (id: string) =>
    apiClient.get<Course>(`/courses/${id}`),

  approve: (id: string) =>
    apiClient.post(`/courses/${id}/approve`),

  reject: (id: string, reason: string) =>
    apiClient.post(`/courses/${id}/reject`, { reason }),

  publish: (id: string) =>
    apiClient.post(`/courses/${id}/publish`),

  unpublish: (id: string) =>
    apiClient.post(`/courses/${id}/unpublish`),

  delete: (id: string) =>
    apiClient.delete(`/courses/${id}`),

  update: (id: string, data: Partial<Course>) =>
    apiClient.put<Course>(`/courses/${id}`, data),
};
