'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/custom/Toast';
import { Mail, Loader2, ArrowLeft, Check } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function ForgotPasswordForm({ onSuccess, onBack }: ForgotPasswordFormProps) {
  const { resetPassword } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error('Request failed', error.message);
      } else {
        setSuccess(true);
        toast.success('Email sent!', 'Check your inbox for the password reset link.');
      }
    } catch (err) {
      toast.error('Request failed', 'An unexpected error occurred');
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
        <p className="text-gray-600 mb-6">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <button
          type="button"
          onClick={onSuccess}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 px-4 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all font-medium shadow-lg shadow-indigo-500/25"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center text-sm text-gray-600 hover:text-indigo-600 mb-2 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to login
      </button>

      <div>
        <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="resetEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3.5 px-4 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Sending...
          </>
        ) : (
          'Send reset link'
        )}
      </button>
    </form>
  );
}
