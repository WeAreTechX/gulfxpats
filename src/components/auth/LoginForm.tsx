'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/custom/Toast';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSignup: () => void;
}

export default function LoginForm({ onSuccess, onForgotPassword, onSignup }: LoginFormProps) {
  const { signIn } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error('Login failed', error.message);
      } else {
        toast.success('Welcome back!', 'You have successfully signed in.');
        onSuccess();
      }
    } catch (err) {
      toast.error('Login failed', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#04724D] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
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

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-[#04724D] hover:text-[#035E3F] font-medium"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-teal-700 text-white py-3.5 px-4 rounded-xl hover:from-[#035E3F] hover:to-teal-700 transition-all flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#04724D]/25 hover:shadow-[#04724D]/40"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don&#39;t have an account?{' '}
        <button
          type="button"
          onClick={onSignup}
          className="text-[#04724D] font-medium hover:text-[#035E3F]"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
