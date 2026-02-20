import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as AdminAPI from '../lib/api/admin';
import { AdminSettings, GenerateReportRequest } from '../types/admin';
import { UpdateUserProfileRequest, UpdateUserStatusRequest } from '../types/user';

export const ADMIN_KEYS = {
    all: ['admin'] as const,
    users: (query: any) => [...ADMIN_KEYS.all, 'users', query] as const,
    userById: (id: string) => [...ADMIN_KEYS.all, 'user', id] as const,
    metrics: () => [...ADMIN_KEYS.all, 'metrics'] as const,
    auditLogs: (query: any) => [...ADMIN_KEYS.all, 'auditLogs', query] as const,
};

export function useAdminUsers(query: { page?: number; limit?: number; userType?: string; accountStatus?: string }) {
    return useQuery({
        queryKey: ADMIN_KEYS.users(query),
        queryFn: () => AdminAPI.getAdminUsers(query),
    });
}

export function useAdminUserById(userId: string) {
    return useQuery({
        queryKey: ADMIN_KEYS.userById(userId),
        queryFn: () => AdminAPI.getAdminUserById(userId),
        enabled: !!userId,
    });
}

export function useUpdateAdminUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserProfileRequest }) =>
            AdminAPI.updateAdminUser(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.userById(variables.id) });
            queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users({}) });
        },
    });
}

export function useUpdateAdminUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusRequest }) =>
            AdminAPI.updateAdminUserStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.userById(variables.id) });
            queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users({}) });
        },
    });
}

export function useAdminMetrics() {
    return useQuery({
        queryKey: ADMIN_KEYS.metrics(),
        queryFn: AdminAPI.getMetricsOverview,
    });
}

export function useUpdateAdminSettings() {
    return useMutation({
        mutationFn: AdminAPI.updateAdminSettings,
    });
}

export function useAuditLogs(query: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    return useQuery({
        queryKey: ADMIN_KEYS.auditLogs(query),
        queryFn: () => AdminAPI.getAuditLogs(query),
    });
}

export function useGenerateReport() {
    return useMutation({
        mutationFn: AdminAPI.generateReport,
        onSuccess: (data) => {
            // Handle file download in component or here if possible
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${new Date().toISOString()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
    });
}
