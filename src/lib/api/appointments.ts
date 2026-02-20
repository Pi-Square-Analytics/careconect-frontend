import api from './api';
import {
    Appointment,
    BookAppointmentRequest,
    RescheduleAppointmentRequest,
    CancelAppointmentRequest,
    UpdateAppointmentStatusRequest,
    AdminUpdateAppointmentRequest
} from '../../types/appointment';

// Patient Endpoints
export const bookAppointment = async (data: BookAppointmentRequest) => {
    return (await api.post<Appointment>('/appointments/book', data)).data;
};

export const getMyAppointments = async () => {
    return (await api.get<Appointment[]>('/appointments/my-appointments')).data;
};

export const rescheduleAppointment = async (appointmentId: string, data: RescheduleAppointmentRequest) => {
    return (await api.put<Appointment>(`/appointments/${appointmentId}/reschedule`, data)).data;
};

export const cancelAppointment = async (appointmentId: string, data: CancelAppointmentRequest) => {
    return (await api.put<Appointment>(`/appointments/${appointmentId}/cancel`, data)).data;
};

// Doctor Endpoints
export const getDoctorAppointments = async () => {
    return (await api.get<Appointment[]>('/appointments/doctor-appointments')).data;
};

export const updateAppointmentStatus = async (appointmentId: string, data: UpdateAppointmentStatusRequest) => {
    return (await api.put<Appointment>(`/appointments/${appointmentId}/status`, data)).data;
};

// Public Endpoints
export const getAvailability = async (doctorId: string, date: string) => {
    return (await api.get<any>(`/appointments/availability/${doctorId}/${date}`)).data;
};

// Admin Endpoints
export const getAllAppointments = async (query?: { page?: number; limit?: number }) => {
    return (await api.get<{ appointments: Appointment[]; total: number }>('/appointments/', { params: query })).data;
};

export const getAppointmentById = async (appointmentId: string) => {
    return (await api.get<Appointment>(`/appointments/${appointmentId}`)).data;
};

export const adminUpdateAppointment = async (appointmentId: string, data: AdminUpdateAppointmentRequest) => {
    return (await api.put<Appointment>(`/appointments/${appointmentId}`, data)).data;
};

export const deleteAppointment = async (appointmentId: string) => {
    return (await api.delete<{ message: string }>(`/appointments/${appointmentId}`)).data;
};
