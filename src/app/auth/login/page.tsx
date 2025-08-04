/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';

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
  const [user, setUser] = useState<User | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Mock authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUsers: { [key: string]: User } = {
        'admin@careconnect.com': { role: 'admin', name: 'Admin User' },
        'doctor@careconnect.com': { role: 'doctor', name: 'Dr. Smith' },
        'patient@careconnect.com': { role: 'patient', name: 'John Doe' },
      };

      const authenticatedUser = mockUsers[formData.email];
      
      if (authenticatedUser && formData.password === 'password123') {
        setUser(authenticatedUser);
        setLoginSuccess(true);
        setError('');
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

  const handleLogout = () => {
    setUser(null);
    setLoginSuccess(false);
    setFormData({
      email: '',
      password: '',
      rememberMe: false,
    });
  };

  // Success state
  if (loginSuccess && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
            <p className="text-gray-600 mb-4">Welcome back, {user.name}</p>
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-teal-800">
                <strong>Role:</strong> {user.role}
                <br />
                <strong>Remember me:</strong> {formData.rememberMe ? 'Yes' : 'No'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Logout & Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6">
              <div className="space-y-6">
                {error && (
                  <div 
                    role="alert"
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter your email"
                    required
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    <input
                      id="remember"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        handleChange({ name: 'rememberMe', value: e.target.checked })
                      }
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-teal-600 hover:text-teal-500"
                    onClick={() => alert('Forgot password functionality would be implemented here')}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button 
                    type="button"
                    className="text-teal-600 hover:text-teal-500 font-medium"
                    onClick={() => alert('Registration page would be implemented here')}
                  >
                    Register
                  </button>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center bg-gray-50">
        <div className="w-96 h-96 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg shadow-lg flex items-center justify-center">
          <div className="text-center text-teal-600">
            <div className="w-24 h-24 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">+</span>
            </div>
            <p className="text-lg font-medium">Healthcare Professional</p>
            <p className="text-sm">Connecting care, empowering health</p>
          </div>
        </div>
      </div>
    </div>
  );
}