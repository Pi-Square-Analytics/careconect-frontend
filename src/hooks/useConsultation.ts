import { useMutation } from '@tanstack/react-query';
import * as ConsultationAPI from '../lib/api/consultation';


export function useCreateConsultation() {
    return useMutation({
        mutationFn: ConsultationAPI.createConsultation,
    });
}
