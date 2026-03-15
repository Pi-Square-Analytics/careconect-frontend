import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ScheduleAPI from '../lib/api/schedule';
import { CreateAvailabilityRequest, UpdateAvailabilityRequest } from '../types/schedule';

export const SCHEDULE_KEYS = {
    all: ['schedule'] as const,
    doctorAvailability: (doctorId: string, date: string) => [...SCHEDULE_KEYS.all, 'doctorAvailability', doctorId, date] as const,
    slots: (doctorId: string, date: string) => [...SCHEDULE_KEYS.all, 'slots', doctorId, date] as const,
};

export function useDoctorAvailability(doctorId: string, date: string, includeBooked: boolean = false) {
    return useQuery({
        queryKey: SCHEDULE_KEYS.doctorAvailability(doctorId, date),
        queryFn: () => ScheduleAPI.getDoctorAvailability(doctorId, date, includeBooked),
        enabled: !!doctorId && !!date,
    });
}

export function useCreateAvailability() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ doctorId, data }: { doctorId: string; data: CreateAvailabilityRequest }) =>
            ScheduleAPI.createAvailability(doctorId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all }); // Brute force invalidation for now
        },
    });
}

export function useUpdateAvailability() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAvailabilityRequest }) =>
            ScheduleAPI.updateAvailability(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
        },
    });
}

export function useDeleteAvailability() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ScheduleAPI.deleteAvailability,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
        },
    });
}
