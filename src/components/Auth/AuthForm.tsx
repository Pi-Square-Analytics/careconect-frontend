/* eslint-disable-next-line */
/* eslint-disable */
// @ts-nocheck
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField } from './InputField';
import { useAuthHooks } from '../../hooks/useAuth';
import { LoginCredentials, RegisterCredentials } from '../../types/auth';

interface AuthFormProps {
  type: 'login' | 'register';
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\+?\d+$/, 'Invalid phone number'),
  userType: z.literal('patient'),
});

export function AuthForm({ type }: AuthFormProps) {
  const { handleAuth, loading, error } = useAuthHooks();
  const schema = type === 'login' ? loginSchema : registerSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginCredentials | RegisterCredentials>({
    resolver: zodResolver(schema),
    defaultValues: type === 'register' ? { userType: 'patient' } : {},
  });

  const onSubmit = (data: LoginCredentials | RegisterCredentials) => {
    handleAuth(data, type);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {type === 'login' ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {type === 'register' && (
          <>
            <InputField
              label="First Name"
              name="firstName"
              type="text"
              register={register}
              error={errors.firstName}
              required
            />
            <InputField
              label="Last Name"
              name="lastName"
              type="text"
              register={register}
              error={errors.lastName}
              required
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              register={register}
              error={errors.phoneNumber}
              required
            />
            <input type="hidden" {...register('userType')} />
          </>
        )}
        <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          required
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          required
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? 'Loading...' : type === 'login' ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  );
}