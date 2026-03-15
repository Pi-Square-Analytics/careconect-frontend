import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as UserAPI from '../lib/api/users';
import { UpdateUserStatusRequest } from '../types/user';

export const USER_KEYS = {
    all: ['users'] as const,
    profile: () => [...USER_KEYS.all, 'profile'] as const,
    completeness: () => [...USER_KEYS.all, 'completeness'] as const,
    search: (query: unknown) => [...USER_KEYS.all, 'search', query] as const,
    list: (query: unknown) => [...USER_KEYS.all, 'list', query] as const,
    byId: (userId: string) => [...USER_KEYS.all, userId] as const,
};

export function useUserProfile() {
    return useQuery({
        queryKey: USER_KEYS.profile(),
        queryFn: UserAPI.getUserProfile,
    });
}

export function useUpdateUserProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserAPI.updateUserProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.profile() });
        },
    });
}

export function useUserProfileCompleteness() {
    return useQuery({
        queryKey: USER_KEYS.completeness(),
        queryFn: UserAPI.getUserProfileCompleteness,
    });
}

// Admin Hooks
export function useUsersList(query: { page?: number; limit?: number; userType?: string; accountStatus?: string }) {
    return useQuery({
        queryKey: USER_KEYS.list(query),
        queryFn: () => UserAPI.listUsers(query),
    });
}

export function useUserSearch(query: { search?: string; userType?: string; page?: number; limit?: number }) {
    return useQuery({
        queryKey: USER_KEYS.search(query),
        queryFn: () => UserAPI.searchUsers(query),
        enabled: !!query.search,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserAPI.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
        },
    });
}

export function useAdminUserProfile(userId: string) {
    return useQuery({
        queryKey: USER_KEYS.byId(userId),
        queryFn: () => UserAPI.getAdminUserProfile(userId),
        enabled: !!userId,
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateUserStatusRequest }) =>
            UserAPI.updateUserStatus(userId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.byId(variables.userId) });
            queryClient.invalidateQueries({ queryKey: USER_KEYS.list({}) }); // Invalidate list broadly
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: UserAPI.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
        },
    });
}
