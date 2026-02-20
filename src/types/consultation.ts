export interface Consultation {
    consultationId: string;
    patientId: string;
    doctorId: string;
    appointmentId: string;
    diagnosis?: string;
    prescription?: string;
    notes?: string;
    createdAt: string;
}

export interface CreateConsultationRequest {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    diagnosis?: string;
    prescription?: string;
    notes?: string;
}
