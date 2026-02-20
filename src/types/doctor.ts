export interface DoctorProfile {
    doctorId: string;
    userId: string;
    medicalLicenseNumber: string;
    specialty: string;
    consultationFee: number;
    isActive: boolean;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
    stats?: {
        totalPatients: number;
        totalConsultations: number;
        rating: number;
    };
}

export interface CreateDoctorRequest {
    email: string;
    phoneNumber: string;
    password: string;
    firstName: string;
    lastName: string;
    medicalLicenseNumber: string;
    specialty: string;
    consultationFee: number;
    isActive: boolean;
}

export interface UpdateDoctorRequest {
    medicalLicenseNumber?: string;
    specialty?: string;
    consultationFee?: number;
    isActive?: boolean;
}

export interface UpdateDoctorStatusRequest {
    isActive: boolean;
    reason?: string;
}

export interface DoctorSearchQuery {
    specialty?: string;
    search?: string;
    isActive?: boolean;
    minFee?: number;
    maxFee?: number;
    page?: number;
    limit?: number;
}
