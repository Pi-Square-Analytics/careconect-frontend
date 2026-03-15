import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as DoctorAPI from '../lib/api/doctors';
import { DoctorSearchQuery, UpdateDoctorRequest, UpdateDoctorStatusRequest } from '../types/doctor';

export const DOCTOR_KEYS = {
    all: ['doctors'] as const,
    publicSearch: (query: unknown) => [...DOCTOR_KEYS.all, 'publicSearch', query] as const,
    publicProfile: (id: string) => [...DOCTOR_KEYS.all, 'publicProfile', id] as const,
    list: (query: unknown) => [...DOCTOR_KEYS.all, 'list', query] as const,
    byId: (id: string) => [...DOCTOR_KEYS.all, id] as const,
    stats: (id: string) => [...DOCTOR_KEYS.all, id, 'stats'] as const,
};

export function usePublicDoctorSearch(query: DoctorSearchQuery) {
    return useQuery({
        queryKey: DOCTOR_KEYS.publicSearch(query),
        queryFn: () => DoctorAPI.searchPublicDoctors(query),
    });
}

export function usePublicDoctorProfile(doctorId: string) {
    return useQuery({
        queryKey: DOCTOR_KEYS.publicProfile(doctorId),
        queryFn: () => DoctorAPI.getPublicDoctorProfile(doctorId),
        enabled: !!doctorId,
    });
}

// Admin Hooks
export function useDoctorsList(query: DoctorSearchQuery) {
    return useQuery({
        queryKey: DOCTOR_KEYS.list(query),
        queryFn: () => DoctorAPI.getDoctors(query),
    });
}

export function useDoctorById(doctorId: string) {
    return useQuery({
        queryKey: DOCTOR_KEYS.byId(doctorId),
        queryFn: () => DoctorAPI.getDoctorById(doctorId),
        enabled: !!doctorId,
    });
}

export function useCreateDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DoctorAPI.createDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.all });
        },
    });
}

export function useUpdateDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDoctorRequest }) =>
            DoctorAPI.updateDoctor(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.byId(variables.id) });
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.list({}) });
        },
    });
}

export function useUpdateDoctorStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDoctorStatusRequest }) =>
            DoctorAPI.updateDoctorStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.byId(variables.id) });
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.list({}) });
        },
    });
}

export function useDeleteDoctor() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DoctorAPI.deleteDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DOCTOR_KEYS.all });
        },
    });
}
