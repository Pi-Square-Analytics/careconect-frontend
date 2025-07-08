'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/Card";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate authentication - replace with actual auth logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user roles for demonstration
      const mockUsers = {
        'admin@careconnect.com': { role: 'admin', name: 'Admin User' },
        'doctor@careconnect.com': { role: 'doctor', name: 'Dr. Smith' },
        'patient@careconnect.com': { role: 'patient', name: 'John Doe' },
      };

      const user = mockUsers[formData.email as keyof typeof mockUsers];
      
      if (user && formData.password === 'password123') {
        // Store user info in localStorage (replace with proper auth)
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect based on role
        switch (user.role) {
          case 'admin':
            router.push('/(dashboard)/admin');
            break;
          case 'doctor':
            router.push('/(dashboard)/doctor');
            break;
          case 'patient':
            router.push('/(dashboard)/patient');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        setError('Invalid email or password');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            {/* <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">CareConnect</span>
            </div> */}
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-600 mt-2">Login to access your CareConnect  account</p>
          </div>

          {/* Demo Credentials */}
          {/* <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-teal-800 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-teal-700 space-y-1">
              <div><strong>Admin:</strong> admin@careconnect.com / password123</div>
              <div><strong>Doctor:</strong> doctor@careconnect.com / password123</div>
              <div><strong>Patient:</strong> patient@careconnect.com / password123</div>
            </div>
          </div> */}

          {/* Login Form */}
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 input-field"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, rememberMe: checked as boolean })
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

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Login...' : 'Login'}
                </button>
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-teal-600 hover:text-teal-500 font-medium">
                      Register
                    </Link>
                  </span>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or login with</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" className="btn-secondary flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button type="button" className="btn-secondary flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button type="button" className="btn-secondary flex items-center justify-center">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>

                {/* Sign Up Link */}
               
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
       <img
          src="/assets/login.png"
          alt="Hero Image"
          className="max-w-full h-96 rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
