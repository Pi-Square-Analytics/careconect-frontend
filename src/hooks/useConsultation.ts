import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ConsultationAPI from '../lib/api/consultation';
import { CreateConsultationRequest } from '../types/consultation';

export function useCreateConsultation() {
    return useMutation({
        mutationFn: ConsultationAPI.createConsultation,
    });
}
