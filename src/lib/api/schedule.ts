import api from './api';
import {
    AvailabilitySlot,
    DoctorAvailability,
    CreateAvailabilityRequest,
    UpdateAvailabilityRequest,
    UpdateAvailabilityStatusRequest,
    BulkUpdateAvailabilityRequest
} from '../../types/schedule';

export const getDoctorAvailability = async (doctorId: string, date: string, includeBooked: boolean = false) => {
    return (await api.get<AvailabilitySlot[]>(`/schedule/doctors/${doctorId}/availability`, {
        params: { date, includeBooked }
    })).data;
};

export const getSlots = async (doctorId: string, date: string, params?: { duration?: number; startTime?: string; endTime?: string }) => {
    return (await api.get<AvailabilitySlot[]>(`/schedule/slots/${doctorId}/${date}`, { params })).data;
};

export const createAvailability = async (doctorId: string, data: CreateAvailabilityRequest) => {
    return (await api.post<DoctorAvailability>(`/schedule/doctors/${doctorId}/availability`, data)).data;
};

export const updateAvailability = async (availabilityId: string, data: UpdateAvailabilityRequest) => {
    return (await api.patch<DoctorAvailability>(`/schedule/availability/${availabilityId}`, data)).data;
};

export const updateAvailabilityStatus = async (availabilityId: string, status: boolean) => {
    return (await api.patch<DoctorAvailability>(`/schedule/availability/${availabilityId}/status`, { status })).data;
};

export const deleteAvailability = async (availabilityId: string) => {
    return (await api.delete<{ message: string }>(`/schedule/availability/${availabilityId}`)).data;
};

export const bulkUpdateAvailability = async (data: BulkUpdateAvailabilityRequest) => {
    return (await api.post<{ message: string }>('/schedule/bulk-update', data)).data;
};
