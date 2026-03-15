import api from './api';
import {
    AdminSettings,
    AuditLog,
    GenerateReportRequest,
    AdminMetrics
} from '../../types/admin';
import { User, UpdateUserProfileRequest, UpdateUserStatusRequest } from '../../types/user';

export const getAdminUsers = async (query: { page?: number; limit?: number; userType?: string; accountStatus?: string }) => {
    return (await api.get<{ users: User[]; total: number }>('/admin/users', { params: query })).data;
};

export const getAdminUserById = async (userId: string) => {
    return (await api.get<User>(`/admin/users/${userId}`)).data;
};

export const updateAdminUser = async (userId: string, data: UpdateUserProfileRequest) => {
    return (await api.patch<User>(`/admin/users/${userId}`, data)).data;
};

export const updateAdminUserStatus = async (userId: string, data: UpdateUserStatusRequest) => {
    return (await api.patch<User>(`/admin/users/${userId}/status`, data)).data;
};

export const deleteAdminUser = async (userId: string) => {
    return (await api.delete<{ message: string }>(`/admin/users/${userId}`)).data;
};

export const getMetricsOverview = async () => {
    return (await api.get<AdminMetrics>('/admin/metrics/overview')).data;
};

export const updateAdminSettings = async (data: AdminSettings) => {
    return (await api.patch<AdminSettings>('/admin/settings', data)).data;
};

export const getAuditLogs = async (query: { page?: number; limit?: number; startDate?: string; endDate?: string }) => {
    return (await api.get<{ logs: AuditLog[]; total: number }>('/admin/audit-logs', { params: query })).data;
};

export const generateReport = async (data: GenerateReportRequest) => {
    return (await api.post<Blob>('/admin/reports/generate', data, { responseType: 'blob' })).data;
};
