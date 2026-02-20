export interface PatientProfile {
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    bloodType?: string;
    height?: number;
    weight?: number;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    insuranceGroupNumber?: string;
    preferredPharmacy?: string;
}

export interface MedicalHistory {
    historyId: string;
    conditionType: string;
    conditionName: string;
    conditionCode?: string;
    severity: 'mild' | 'moderate' | 'severe';
    onsetDate: string;
    resolvedDate?: string;
    notes?: string;
}

export interface CreateMedicalHistoryRequest {
    conditionType: string;
    conditionName: string;
    conditionCode?: string;
    severity: 'mild' | 'moderate' | 'severe';
    onsetDate: string;
    resolvedDate?: string;
    notes?: string;
}

export interface Allergy {
    allergyId: string;
    allergenType: string;
    allergenName: string;
    reactionSeverity: 'mild' | 'moderate' | 'severe';
    symptoms: string;
    firstOccurrence?: string;
    lastOccurrence?: string;
    treatmentNotes?: string;
}

export interface CreateAllergyRequest {
    allergenType: string;
    allergenName: string;
    reactionSeverity: 'mild' | 'moderate' | 'severe';
    symptoms: string;
    firstOccurrence?: string;
    lastOccurrence?: string;
    treatmentNotes?: string;
}

export interface Medication {
    medicationId: string;
    medicationName: string;
    genericName?: string;
    dosage: string;
    frequency: string;
    route: string;
    startDate: string;
    endDate?: string;
    pharmacyFilled?: string;
    sideEffects?: string;
    isActive: boolean;
}

export interface CreateMedicationRequest {
    medicationName: string;
    genericName?: string;
    dosage: string;
    frequency: string;
    route: string;
    startDate: string;
    endDate?: string;
    pharmacyFilled?: string;
    sideEffects?: string;
    isActive: boolean;
}

export interface PatientPreferences {
    preferredCommunicationMethod: 'email' | 'sms' | 'phone';
    appointmentReminderTiming: number;
    dataSharingConsent: {
        allowDataSharing: boolean;
        consentDate: string;
        consentVersion: string;
    };
    marketingConsent: boolean;
    researchParticipationConsent: boolean;
    familyAccessPermissions: {
        relationship: string;
        accessLevel: 'full' | 'read-only';
    }[];
    privacySettings: {
        shareWithFamilyMembers: boolean;
        shareWithPrimaryCare: boolean;
        shareForResearch: boolean;
    };
}
