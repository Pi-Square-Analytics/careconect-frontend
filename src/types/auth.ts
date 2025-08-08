export interface User {
  userId: string;
  email: string;
  phoneNumber: string;
  userType: 'patient' | 'admin' | 'doctor';
  accountStatus: string;
  emailVerified: boolean | null;
  phoneVerified: boolean | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  loginAttempts: number | null;
  accountLockedUntil: string | null;
  profile: {
    firstName: string;
    lastName: string;
  };
}

export interface AuthResponse {
  error: string;
  success: boolean;
  data: LoginResponseData | RegisterResponseData;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterResponseData {
  userId: string;
  email: string;
  phoneNumber: string;
  passwordHash: string;
  userType: 'patient';
  accountStatus: string;
  emailVerified: boolean | null;
  phoneVerified: boolean | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  loginAttempts: number | null;
  accountLockedUntil: string | null;
  profile: {
    firstName: string;
    lastName: string;
  };
}

export interface AuthError {
  success: false;
  error: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: 'patient';
}