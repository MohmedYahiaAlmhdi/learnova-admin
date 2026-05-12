import apiClient from './axios';
import type { AuthTokens, LoginCredentials, ResetPasswordPayload, User } from '@/shared/types';

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/login', credentials),

  logout: () =>
    apiClient.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ tokens: AuthTokens }>('/auth/refresh', { refreshToken }),

  getProfile: () =>
    apiClient.get<User>('/auth/profile'),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post('/auth/reset-password', payload),

  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post('/auth/verify-otp', { email, otp }),

  resendOtp: (email: string) =>
    apiClient.post('/auth/resend-otp', { email }),
};
