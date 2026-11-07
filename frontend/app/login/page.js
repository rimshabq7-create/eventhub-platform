'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if user exists
    const user = users.find((u) => u.email === email && u.password === password);

    // Check default admin
    if (email === 'admin@eventhub.com' && password === 'Admin@12345') {
      const adminUser = { name: 'Admin', email, role: 'admin' };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      router.push('/');
      return;
    }

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      router.push('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-light px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-secondary p-8 text-center text-white">
          <div className="text-5xl mb-3">📅</div>
          <h1 className="text-2xl font-bold">Welcome Back!</h1>
          <p className="text-white/80 text-sm mt-1">Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📧 Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔒 Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-secondary focus:outline-none transition pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              🚀 Sign In
            </button>
          </form>

          <div className="text-center mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-secondary font-semibold hover:underline">
                Sign up now
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-4 p-4 bg-light rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-2">🔑 Demo Credentials:</p>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Admin:</span>
                <code className="text-primary">admin@eventhub.com / Admin@12345</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}