'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/custom/Toast';
import { Mail, Lock, User, MapPin, Loader2, Eye, EyeOff, Check } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

interface SignupFormProps {
  onSuccess: () => void;
  onLogin: () => void;
}

export default function SignupForm({ onSuccess, onLogin }: SignupFormProps) {
  const { signUp } = useAuth();
  const toast = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.country_code_iso3) {
        setLocation(data.country_code_iso3);
      }
    } catch (error) {
      console.log('Could not auto-detect location');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast.error('Validation error', 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, firstName, lastName, location);
      
      if (error) {
        toast.error('Signup failed', error.message);
      } else {
        setSuccess(true);
        toast.success('Account created!', 'Your account was created successfully.');
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      toast.error('Signup failed', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Account created!</h3>
        <p className="text-sm text-gray-600">Logging you in...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="signupEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="signupPassword"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            required
            minLength={6}
            className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Country <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none transition-all text-gray-900 appearance-none"
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.iso3}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-1.5 text-xs text-gray-500">
          Auto-detected based on your location
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-700 text-white py-3.5 px-4 rounded-xl hover:from-[#035E3F] hover:to-teal-700 transition-all flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#04724D]/25 hover:shadow-[#04724D]/40 mt-6"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onLogin}
          className="text-[#04724D] font-medium hover:text-[#035E3F]"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
