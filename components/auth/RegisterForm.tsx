// components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptsMarketing: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await register(formData);
      setSuccess(true);
      // Redirect to login after successful registration
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="w-full max-w-sm text-center">
          <div className="text-primary mb-6">
            <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-secondary mb-3 tracking-tight">Account Created!</h2>
          <p className="text-slate-500 font-light">Your account has been created successfully. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-secondary tracking-tight">
            Create Account
          </h1>
          <p className="text-slate-500 mt-2 font-light">
            Join us today
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label 
                htmlFor="firstName" 
                className="block text-sm font-medium text-slate-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
                placeholder="John"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <label 
                htmlFor="lastName" 
                className="block text-sm font-medium text-slate-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
                placeholder="Doe"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-slate-700"
            >
              Email *
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
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
              placeholder="Create a secure password"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-slate-700"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-0 py-3 text-secondary bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-start space-x-3 pt-2">
            <div className="flex items-center h-6">
              <input
                type="checkbox"
                id="acceptsMarketing"
                name="acceptsMarketing"
                checked={formData.acceptsMarketing}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded transition-colors"
                disabled={isSubmitting}
              />
            </div>
            <label htmlFor="acceptsMarketing" className="text-sm text-slate-600 leading-6">
              I would like to receive marketing emails and updates
            </label>
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
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-primary hover:text-secondary transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}