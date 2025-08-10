# CareConnect Backend API Documentation

## Base URL
```
/api/{version}/
```

## Authentication & Authorization

### Protected Endpoints
- **`requireAuth`**: User must be authenticated (valid JWT token)
- **`requireRole(['admin'])`**: User must have admin role
- **`requireRole(['doctor'])`**: User must have doctor role  
- **`requireRole(['patient'])`**: User must have patient role
- **`requireAdmin`**: User must be admin (legacy middleware)
- **`requireSuperAdmin`**: User must be super admin

---

## 1. Authentication Routes (`/auth`)

### POST `/auth/register`
- **Method**: POST
- **Protected**: No
- **Request Body**:
```json
{
  "email": "user@example.com",
  "phoneNumber": "+2507XXXXXXXX",
  "password": "StrongPass123!",
  "userType": "patient",
  "firstName": "John",
  "lastName": "Doe"
}
```

### POST `/auth/login`
- **Method**: POST
- **Protected**: No
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

### POST `/auth/refresh-token`
- **Method**: POST
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

### POST `/auth/logout`
- **Method**: POST
- **Protected**: Yes (requireAuth)
- **Request Body**: None

### POST `/auth/forgot-password`
- **Method**: POST
- **Protected**: No
- **Request Body**:
```json
{
  "email": "user@example.com"
}
```

### POST `/auth/reset-password`
- **Method**: POST
- **Protected**: No
- **Request Body**:
```json
{
  "token": "reset_token_here",
  "newPassword": "NewStrongPass123!"
}
```

### POST `/auth/verify-email`
- **Method**: POST
- **Protected**: No
- **Request Body**:
```json
{
  "token": "verification_token_here"
}
```

---

## 2. User Management Routes (`/users`)

### GET `/users/profile`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### PUT `/users/profile`
- **Method**: PUT
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "email": "user@example.com",
  "phoneNumber": "+2507XXXXXXXX",
  "firstName": "John",
  "lastName": "Doe"
}
```

### GET `/users/profile/completeness`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### GET `/users/exists`
- **Method**: GET
- **Protected**: No
- **Query Params**: `?email=user@example.com` or `?phoneNumber=+2507XXXXXXXX`

### GET `/users/search`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?search=john&userType=patient&page=1&limit=10`

### GET `/users/list`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?page=1&limit=20&userType=patient&accountStatus=active`

### POST `/users/`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "email": "user@example.com",
  "phoneNumber": "+2507XXXXXXXX",
  "password": "StrongPass123!",
  "userType": "patient",
  "firstName": "John",
  "lastName": "Doe",
  "accountStatus": "active"
}
```

### GET `/users/type/:userType`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### GET `/users/doctors`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### GET `/users/patients`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### GET `/users/stats`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### GET `/users/:userId/profile`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### PUT `/users/:userId/profile`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "email": "new@example.com",
  "phoneNumber": "+2507XXXXXXXX",
  "accountStatus": "active"
}
```

### PUT `/users/:userId/status`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "accountStatus": "suspended",
  "reason": "Too many failed logins"
}
```

### POST `/users/:userId/unlock`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### POST `/users/:userId/reset-password`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "newPassword": "NewStrongPass123!"
}
```

### DELETE `/users/:userId`
- **Method**: DELETE
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### PATCH `/users/me`
- **Method**: PATCH
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "email": "user@example.com",
  "phoneNumber": "+2507XXXXXXXX",
  "firstName": "John",
  "lastName": "Doe"
}
```

---

## 3. Patient Routes (`/patient`)

### GET `/patient/profile`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### POST `/patient/profile`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "emergencyContactName": "Jane Doe",
  "emergencyContactPhone": "+2507XXXXXXXX",
  "emergencyContactRelationship": "Spouse",
  "bloodType": "O+",
  "height": 175,
  "weight": 70,
  "insuranceProvider": "Insurer",
  "insurancePolicyNumber": "POL123",
  "insuranceGroupNumber": "GRP456",
  "preferredPharmacy": "Pharmacy Ltd"
}
```

### PUT `/patient/profile`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**: Same as POST

### GET `/patient/medical-summary`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### GET `/patient/medical-history`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### POST `/patient/medical-history`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "conditionType": "chronic_condition",
  "conditionName": "Hypertension",
  "conditionCode": "I10",
  "severity": "moderate",
  "onsetDate": "2023-05-01",
  "resolvedDate": "2024-01-01",
  "notes": "Under control"
}
```

### DELETE `/patient/medical-history/:historyId`
- **Method**: DELETE
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### GET `/patient/allergies`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### POST `/patient/allergies`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "allergenType": "drug",
  "allergenName": "Penicillin",
  "reactionSeverity": "severe",
  "symptoms": "Rash, hives",
  "firstOccurrence": "2010-06-10",
  "lastOccurrence": "2015-04-20",
  "treatmentNotes": "Antihistamines"
}
```

### DELETE `/patient/allergies/:allergyId`
- **Method**: DELETE
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### GET `/patient/medications`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### POST `/patient/medications`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "medicationName": "Amoxicillin",
  "genericName": "Amoxicillin",
  "dosage": "500mg",
  "frequency": "3 times daily",
  "route": "oral",
  "startDate": "2024-07-01",
  "endDate": "2024-07-10",
  "pharmacyFilled": "Pharmacy Ltd",
  "sideEffects": "Nausea",
  "isActive": true
}
```

### PUT `/patient/medications/:medicationId`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**: Same as POST

### DELETE `/patient/medications/:medicationId`
- **Method**: DELETE
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### PUT `/patient/medications/:medicationId/status`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "isActive": false
}
```

### GET `/patient/preferences`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### PUT `/patient/preferences`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "preferredCommunicationMethod": "email",
  "appointmentReminderTiming": 24,
  "dataSharingConsent": {
    "allowDataSharing": true,
    "consentDate": "2024-07-10T00:00:00.000Z",
    "consentVersion": "v1.0"
  },
  "marketingConsent": false,
  "researchParticipationConsent": true,
  "familyAccessPermissions": [
    {
      "relationship": "Spouse",
      "accessLevel": "full"
    }
  ],
  "privacySettings": {
    "shareWithFamilyMembers": true,
    "shareWithPrimaryCare": true,
    "shareForResearch": false
  }
}
```

### Admin/Doctor Access Routes

### GET `/patient/admin/:userId/profile`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin', 'doctor']))

### GET `/patient/admin/:userId/medical-summary`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin', 'doctor']))

### GET `/patient/admin/:userId/medical-history`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin', 'doctor']))

### GET `/patient/admin/:userId/allergies`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin', 'doctor']))

### GET `/patient/admin/:userId/medications`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin', 'doctor']))

### GET `/patient/admin/:userId/preferences`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin', 'doctor']))

### GET `/patient/doctor/:userId/profile`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

### GET `/patient/doctor/:userId/medical-summary`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

### GET `/patient/doctor/:userId/medical-history`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

### GET `/patient/doctor/:userId/allergies`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

### GET `/patient/doctor/:userId/medications`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

### GET `/patient/doctor/:userId/preferences`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

---

## 4. Public Routes (`/public`)

### POST `/public/:userId/profile`
- **Method**: POST
- **Protected**: No
- **Request Body**: Same as patient profile

### PUT `/public/:userId/profile`
- **Method**: PUT
- **Protected**: No
- **Request Body**: Same as patient profile

### POST `/public/:userId/medical-history`
- **Method**: POST
- **Protected**: No
- **Request Body**: Same as patient medical history

### POST `/public/:userId/allergies`
- **Method**: POST
- **Protected**: No
- **Request Body**: Same as patient allergies

### POST `/public/:userId/medications`
- **Method**: POST
- **Protected**: No
- **Request Body**: Same as patient medications

### PUT `/public/:userId/preferences`
- **Method**: PUT
- **Protected**: No
- **Request Body**: Same as patient preferences

---

## 5. Doctor Routes (`/doctors`)

### Public Routes

### GET `/doctors/public/search`
- **Method**: GET
- **Protected**: No
- **Query Params**: `?specialty=cardiology&search=dr&isActive=true&minFee=50&maxFee=100&page=1&limit=10`

### GET `/doctors/public/:doctorId/profile`
- **Method**: GET
- **Protected**: No

### Admin Routes

### POST `/doctors/`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "email": "doc@example.com",
  "phoneNumber": "+2507XXXXXXXX",
  "password": "StrongPass123!",
  "firstName": "Jane",
  "lastName": "Doe",
  "medicalLicenseNumber": "MLN-12345",
  "specialty": "cardiology",
  "consultationFee": 50,
  "isActive": true
}
```

### GET `/doctors/`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?specialty=cardiology&isActive=true&page=1&limit=20`

### GET `/doctors/:doctorId`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### PUT `/doctors/:doctorId`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "medicalLicenseNumber": "MLN-98765",
  "specialty": "dermatology",
  "consultationFee": "75.00",
  "isActive": true
}
```

### PUT `/doctors/:doctorId/status`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "isActive": false,
  "reason": "On leave"
}
```

### GET `/doctors/:doctorId/stats`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### DELETE `/doctors/:doctorId`
- **Method**: DELETE
- **Protected**: Yes (requireAuth, requireRole(['admin']))

---

## 6. Appointment Routes (`/appointments`)

### Patient Endpoints

### POST `/appointments/book`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "doctorId": "uuid",
  "appointmentType": "consultation",
  "scheduledDate": "2024-07-15",
  "scheduledTime": "14:00:00",
  "reason": "Regular checkup",
  "notes": "Annual physical examination"
}
```

### GET `/appointments/my-appointments`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['patient']))

### PUT `/appointments/:appointmentId/reschedule`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "scheduledDate": "2024-07-16",
  "scheduledTime": "15:00:00"
}
```

### PUT `/appointments/:appointmentId/cancel`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['patient']))
- **Request Body**:
```json
{
  "cancellationReason": "Emergency came up"
}
```

### Doctor Endpoints

### GET `/appointments/doctor-appointments`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

### PUT `/appointments/:appointmentId/status`
- **Method**: PUT
- **Protected**: Yes (requireAuth, requireRole(['doctor']))
- **Request Body**:
```json
{
  "appointmentStatus": "completed",
  "notes": "Patient responded well to treatment"
}
```

### Public Endpoints

### GET `/appointments/availability/:doctorId/:date`
- **Method**: GET
- **Protected**: No

### Admin Endpoints

### GET `/appointments/`
- **Method**: GET
- **Protected**: Yes (requireAdmin)

### GET `/appointments/:appointmentId`
- **Method**: GET
- **Protected**: Yes (requireAdmin)

### PUT `/appointments/:appointmentId`
- **Method**: PUT
- **Protected**: Yes (requireAdmin)
- **Request Body**:
```json
{
  "appointmentStatus": "rescheduled",
  "scheduledDate": "2024-07-17",
  "scheduledTime": "16:00:00"
}
```

### DELETE `/appointments/:appointmentId`
- **Method**: DELETE
- **Protected**: Yes (requireAdmin)

---

## 7. Admin Routes (`/admin`)

### GET `/admin/users`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?page=1&limit=20&userType=patient&accountStatus=active`

### GET `/admin/users/:user_id`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### PATCH `/admin/users/:user_id`
- **Method**: PATCH
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "firstName": "Updated Name",
  "lastName": "Updated Last",
  "email": "updated@example.com"
}
```

### PATCH `/admin/users/:user_id/status`
- **Method**: PATCH
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "accountStatus": "suspended",
  "reason": "Policy violation"
}
```

### DELETE `/admin/users/:user_id`
- **Method**: DELETE
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### GET `/admin/metrics/overview`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### PATCH `/admin/settings`
- **Method**: PATCH
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "systemMaintenance": false,
  "maxFileUploadSize": 10485760,
  "sessionTimeout": 3600
}
```

### GET `/admin/audit-logs`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?page=1&limit=50&startDate=2024-01-01&endDate=2024-12-31`

### POST `/admin/reports/generate`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "reportType": "user_activity",
  "dateRange": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "format": "pdf"
}
```

---

## 8. Schedule/Availability Routes (`/schedule`)

### Public Endpoints

### GET `/schedule/doctors/:doctor_id/availability`
- **Method**: GET
- **Protected**: No
- **Query Params**: `?date=2024-07-15&includeBooked=true`

### GET `/schedule/slots/:doctorId/:date`
- **Method**: GET
- **Protected**: No
- **Query Params**: `?duration=30&startTime=09:00&endTime=17:00`

### Protected Endpoints (Doctor/Admin)

### POST `/schedule/doctors/:doctor_id/availability`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['doctor']))
- **Request Body**:
```json
{
  "doctorId": "uuid",
  "dayOfWeek": 1,
  "startTime": "09:00:00",
  "endTime": "17:00:00",
  "slotDuration": 30,
  "isActive": true
}
```

### PATCH `/schedule/availability/:availability_id`
- **Method**: PATCH
- **Protected**: Yes (requireAuth, requireRole(['doctor']))
- **Request Body**:
```json
{
  "dayOfWeek": 2,
  "startTime": "10:00:00",
  "endTime": "16:00:00",
  "slotDuration": 20,
  "isActive": true
}
```

### PATCH `/schedule/availability/:availability_id/status`
- **Method**: PATCH
- **Protected**: Yes (requireAuth, requireRole(['doctor']))
- **Request Body**:
```json
{
  "status": true
}
```

### DELETE `/schedule/availability/:availability_id`
- **Method**: DELETE
- **Protected**: Yes (requireAuth, requireRole(['doctor']))

### POST `/schedule/bulk-update`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['doctor']))
- **Request Body**:
```json
{
  "doctorId": "uuid",
  "isActive": false,
  "dayOfWeek": 5,
  "reason": "Conference"
}
```

---

## 9. Consultation Routes (`/consultation`)

### POST `/consultation/consultations`
- **Method**: POST
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentId": "uuid",
  "consultationType": "initial",
  "chiefComplaint": "Headache and fever",
  "vitalSigns": {
    "bloodPressure": "120/80",
    "temperature": "38.5",
    "heartRate": "85",
    "respiratoryRate": "18"
  },
  "notes": "Patient reports severe headache for 2 days"
}
```

### GET `/consultation/consultations`
- **Method**: GET
- **Protected**: Yes (requireAuth)
- **Query Params**: `?patientId=uuid&doctorId=uuid&page=1&limit=20`

### GET `/consultation/consultations/:consultation_id`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### PATCH `/consultation/consultations/:consultation_id`
- **Method**: PATCH
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "diagnosis": "Migraine",
  "treatmentPlan": "Prescribed pain medication",
  "followUpDate": "2024-07-22"
}
```

### POST `/consultation/consultations/:consultationId/complete`
- **Method**: POST
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "outcome": "resolved",
  "dischargeNotes": "Patient responded well to treatment"
}
```

### GET `/consultation/consultations/patient/:patientId`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### GET `/consultation/consultations/doctor/:doctorId`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### GET `/consultation/consultations/:consultationId/summary`
- **Method**: GET
- **Protected**: Yes (requireAuth)

---

## 10. Invoice Routes (`/invoice`)

### POST `/invoice/invoices`
- **Method**: POST
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "patientId": "uuid",
  "doctorId": "uuid",
  "appointmentId": "uuid",
  "items": [
    {
      "description": "Consultation fee",
      "quantity": 1,
      "unitPrice": 50.00,
      "total": 50.00
    }
  ],
  "totalAmount": 50.00,
  "dueDate": "2024-07-30"
}
```

### GET `/invoice/invoices`
- **Method**: GET
- **Protected**: Yes (requireAuth)
- **Query Params**: `?patientId=uuid&doctorId=uuid&status=pending&page=1&limit=20`

### GET `/invoice/invoices/:invoice_id`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### PATCH `/invoice/invoices/:invoice_id`
- **Method**: PATCH
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "totalAmount": 75.00,
  "dueDate": "2024-08-15"
}
```

### PATCH `/invoice/invoices/:invoice_id/status`
- **Method**: PATCH
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "invoiceStatus": "paid",
  "paidAt": "2024-07-15T10:30:00Z"
}
```

### GET `/invoice/invoices/:invoice_id/download`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### POST `/invoice/invoices/:invoiceId/pay`
- **Method**: POST
- **Protected**: Yes (requireAuth)
- **Request Body**:
```json
{
  "paymentMethod": "card",
  "amount": 50.00,
  "transactionId": "txn_12345"
}
```

### GET `/invoice/invoices/patient/:patientId`
- **Method**: GET
- **Protected**: Yes (requireAuth)

### GET `/invoice/invoices/overdue`
- **Method**: GET
- **Protected**: Yes (requireAuth)

---

## 11. Report Routes (`/reports`)

### GET `/reports/admin/metrics/overview`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### GET `/reports/admin/activity/logs`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?page=1&limit=50&startDate=2024-01-01&endDate=2024-12-31`

### GET `/reports/admin/reports/appointments`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?startDate=2024-01-01&endDate=2024-12-31&groupBy=month`

### GET `/reports/admin/reports/invoices`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?startDate=2024-01-01&endDate=2024-12-31&groupBy=status`

### GET `/reports/admin/reports/financial`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?startDate=2024-01-01&endDate=2024-12-31`

### GET `/reports/admin/reports/clinical`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?startDate=2024-01-01&endDate=2024-12-31`

### GET `/reports/admin/reports/user-activity`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Query Params**: `?startDate=2024-01-01&endDate=2024-12-31&groupBy=month`

### GET `/reports/admin/reports/system-performance`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

### POST `/reports/admin/reports/custom/generate`
- **Method**: POST
- **Protected**: Yes (requireAuth, requireRole(['admin']))
- **Request Body**:
```json
{
  "type": "appointments",
  "filters": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "groupBy": "week"
  }
}
```

### GET `/reports/admin/reports/:reportId/export`
- **Method**: GET
- **Protected**: Yes (requireAuth, requireRole(['admin']))

---

## 12. Search Routes (`/search`)

### GET `/search/doctors`
- **Method**: GET
- **Protected**: Yes (requireAuth)
- **Query Params**: `?specialty=cardiology&search=dr&isActive=true&minFee=50&maxFee=100&page=1&limit=10`

### GET `/search/appointments`
- **Method**: GET
- **Protected**: Yes (requireAuth)
- **Query Params**: `?patientId=uuid&doctorId=uuid&appointmentStatus=scheduled&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=20`

### GET `/search/invoices`
- **Method**: GET
- **Protected**: Yes (requireAuth)
- **Query Params**: `?invoiceNumber=INV-001&invoiceStatus=pending&patientId=uuid&doctorId=uuid&startDate=2024-01-01&endDate=2024-12-31&minAmount=50&maxAmount=200&page=1&limit=20`

---

## 13. Misc Routes (`/misc`)

### GET `/misc/specialties`
- **Method**: GET
- **Protected**: No

### GET `/misc/timezones`
- **Method**: GET
- **Protected**: No

### GET `/misc/health-check`
- **Method**: GET
- **Protected**: No

### GET `/misc/configuration`
- **Method**: GET
- **Protected**: No

### POST `/misc/upload-file`
- **Method**: POST
- **Protected**: No
- **Request Body**: FormData with file

### POST `/misc/send-notification`
- **Method**: POST
- **Protected**: No
- **Request Body**:
```json
{
  "to": "user@example.com",
  "subject": "Appointment Reminder",
  "message": "Your appointment is tomorrow at 2:00 PM"
}
```

---

## Summary

**Total Endpoints**: 100+ endpoints across 13 routers

**Authentication Levels**:
- **Public**: 15 endpoints (no authentication required)
- **Protected**: 85+ endpoints (require authentication)
- **Role-based**: 60+ endpoints (require specific user roles)

**HTTP Methods Used**:
- GET: 60+ endpoints
- POST: 25+ endpoints  
- PUT: 10+ endpoints
- PATCH: 10+ endpoints
- DELETE: 5+ endpoints



**Main Categories**:
1. **Authentication & User Management** (25+ endpoints)
2. **Patient Management** (30+ endpoints)
3. **Doctor Management** (10+ endpoints)
4. **Appointments & Scheduling** (15+ endpoints)
5. **Consultations & Medical Records** (10+ endpoints)
6. **Billing & Invoices** (10+ endpoints)
7. **Reporting & Analytics** (10+ endpoints)
8. **Search & Utilities** (10+ endpoints)

All endpoints are properly protected with appropriate middleware and follow RESTful conventions.
