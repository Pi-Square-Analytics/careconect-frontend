import api from './api';
import {
    Consultation,
    CreateConsultationRequest
} from '../../types/consultation';

export const createConsultation = async (data: CreateConsultationRequest) => {
    return (await api.post<Consultation>('/consultation/consultations', data)).data;
};
