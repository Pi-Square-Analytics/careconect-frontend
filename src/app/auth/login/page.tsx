'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface User {
  role: 'admin' | 'doctor' | 'patient';
  name: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock authentication (replace with actual API call)
      const mockUsers: { [key: string]: User } = {
        'admin@careconnect.com': { role: 'admin', name: 'Admin User' },
        'doctor@careconnect.com': { role: 'doctor', name: 'Dr. Smith' },
        'patient@careconnect.com': { role: 'patient', name: 'John Doe' },
      };

      const user = mockUsers[formData.email];
      
      if (user && formData.password === 'password123') {
        try {
          // Use sessionStorage for non-persistent sessions, localStorage for persistent
          const storage = formData.rememberMe ? localStorage : sessionStorage;
          storage.setItem('user', JSON.stringify(user));

          // Redirect based on role
          const redirectPath = {
            admin: '/admin',
            doctor: '/doctor',
            patient: '/patient',
          }[user.role] || '/dashboard';

          router.push(redirectPath);
        } catch (storageError) {
          setError('Failed to store session data. Please try again.');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: boolean }
  ) => {
    const { name, value } = 'target' in e ? e.target : e;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Header with Logo */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">CareConnect</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-600 mt-2">Login to access your CareConnect account</p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-teal-800 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-teal-700 space-y-1">
              <div><strong>Admin:</strong> admin@careconnect.com / password123</div>
              <div><strong>Doctor:</strong> doctor@careconnect.com / password123</div>
              <div><strong>Patient:</strong> patient@careconnect.com / password123</div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {error && (
                  <div 
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="pr-10"
                      placeholder="Enter your password"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        handleChange({ name: 'rememberMe', value: checked as boolean })
                      }
                    />
                    <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </Label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-teal-600 hover:text-teal-500"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                  variant="default"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-teal-600 hover:text-teal-500 font-medium">
                    Register
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gray-50">
        <img
          src="/assets/login.png"
          alt="Healthcare professional"
          className="max-w-full h-96 rounded-lg shadow-lg object-cover"
          loading="lazy"
        />
      </div>
    </div>
  );
}