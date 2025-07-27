// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(formData);
      router.push('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-secondary tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-2 font-light">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <a href="/auth/register" className="font-medium text-primary hover:text-secondary transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}