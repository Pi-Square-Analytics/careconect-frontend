import api from './api';
import {
    DoctorProfile,
    DoctorSearchQuery,
    CreateDoctorRequest,
    UpdateDoctorRequest,
    UpdateDoctorStatusRequest
} from '../../types/doctor';

export const searchPublicDoctors = async (query: DoctorSearchQuery) => {
    return (await api.get<{ doctors: DoctorProfile[]; total: number }>('/doctors/public/search', { params: query })).data;
};

export const getPublicDoctorProfile = async (doctorId: string) => {
    return (await api.get<DoctorProfile>(`/doctors/public/${doctorId}/profile`)).data;
};

// Admin Routes
export const createDoctor = async (data: CreateDoctorRequest) => {
    return (await api.post<DoctorProfile>('/doctors/', data)).data;
};

export const getDoctors = async (query: DoctorSearchQuery) => {
    return (await api.get<{ doctors: DoctorProfile[]; total: number }>('/doctors/', { params: query })).data;
};

export const getDoctorById = async (doctorId: string) => {
    return (await api.get<DoctorProfile>(`/doctors/${doctorId}`)).data;
};

export const updateDoctor = async (doctorId: string, data: UpdateDoctorRequest) => {
    return (await api.put<DoctorProfile>(`/doctors/${doctorId}`, data)).data;
};

export const updateDoctorStatus = async (doctorId: string, data: UpdateDoctorStatusRequest) => {
    return (await api.put<DoctorProfile>(`/doctors/${doctorId}/status`, data)).data;
};

export const getDoctorStats = async (doctorId: string) => {
    return (await api.get<unknown>(`/doctors/${doctorId}/stats`)).data;
};

export const deleteDoctor = async (doctorId: string) => {
    return (await api.delete<{ message: string }>(`/doctors/${doctorId}`)).data;
};
