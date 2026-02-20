import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as AppointmentAPI from '../lib/api/appointments';
import {
    BookAppointmentRequest,
    RescheduleAppointmentRequest,
    CancelAppointmentRequest,
    UpdateAppointmentStatusRequest,
    AdminUpdateAppointmentRequest
} from '../types/appointment';

export const APPOINTMENT_KEYS = {
    all: ['appointments'] as const,
    my: () => [...APPOINTMENT_KEYS.all, 'my'] as const,
    doctor: () => [...APPOINTMENT_KEYS.all, 'doctor'] as const,
    list: (query: any) => [...APPOINTMENT_KEYS.all, 'list', query] as const,
    byId: (id: string) => [...APPOINTMENT_KEYS.all, id] as const,
    availability: (doctorId: string, date: string) => [...APPOINTMENT_KEYS.all, 'availability', doctorId, date] as const,
};

// Patient Hooks
export function useBookAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AppointmentAPI.bookAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.my() });
            // Invalidate availability for that doctor/date would be ideal but tricky to guess date from mutation result without parsing
        },
    });
}

export function useMyAppointments() {
    return useQuery({
        queryKey: APPOINTMENT_KEYS.my(),
        queryFn: AppointmentAPI.getMyAppointments,
    });
}

export function useRescheduleAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RescheduleAppointmentRequest }) =>
            AppointmentAPI.rescheduleAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.my() });
        },
    });
}

export function useCancelAppointment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CancelAppointmentRequest }) =>
            AppointmentAPI.cancelAppointment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.my() });
        },
    });
}

// Doctor Hooks
export function useDoctorAppointments() {
    return useQuery({
        queryKey: APPOINTMENT_KEYS.doctor(),
        queryFn: AppointmentAPI.getDoctorAppointments,
    });
}

export function useUpdateAppointmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentStatusRequest }) =>
            AppointmentAPI.updateAppointmentStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.doctor() });
            queryClient.invalidateQueries({ queryKey: APPOINTMENT_KEYS.list({}) });
        },
    });
}

export function useAvailability(doctorId: string, date: string) {
    return useQuery({
        queryKey: APPOINTMENT_KEYS.availability(doctorId, date),
        queryFn: () => AppointmentAPI.getAvailability(doctorId, date),
        enabled: !!doctorId && !!date,
    });
}

// Admin Hooks
export function useAllAppointments(query: { page?: number; limit?: number } = {}) {
    return useQuery({
        queryKey: APPOINTMENT_KEYS.list(query),
        queryFn: () => AppointmentAPI.getAllAppointments(query),
    });
}
