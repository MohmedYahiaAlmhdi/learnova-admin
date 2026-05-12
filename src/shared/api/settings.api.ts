import apiClient from './axios';
import type { SystemSettings } from '@/shared/types';

export const settingsApi = {
  get: () =>
    apiClient.get<SystemSettings>('/settings'),

  update: (section: string, data: Record<string, unknown>) =>
    apiClient.put(`/settings/${section}`, data),
};
