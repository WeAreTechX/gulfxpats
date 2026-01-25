'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function AuthModal() {
  const { authModalMode, closeAuthModal, openAuthModal } = useAuth();

  const getTitle = () => {
    switch (authModalMode) {
      case 'login':
        return 'Welcome back';
      case 'signup':
        return 'Create account';
      case 'forgot-password':
        return 'Reset password';
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (authModalMode) {
      case 'login':
        return 'Sign in to access your account';
      case 'signup':
        return 'Join us to discover amazing opportunities';
      case 'forgot-password':
        return "Enter your email and we'll send you a reset link";
      default:
        return '';
    }
  };

  return (
    <Transition appear show={authModalMode !== null} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeAuthModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-2xl transition-all">
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-br from-[#04724D] via-teal-600 to-teal-700 px-6 py-8 text-white">
                  {/* Close button */}
                  <button
                    onClick={closeAuthModal}
                    className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Logo */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Jingu</span>
                  </div>

                  <Dialog.Title as="h3" className="text-2xl font-bold">
                    {getTitle()}
                  </Dialog.Title>
                  <p className="mt-2 text-white/80 text-sm">
                    {getDescription()}
                  </p>
                </div>

                {/* Form content */}
                <div className="p-6">
                  {authModalMode === 'login' && (
                    <LoginForm 
                      onSuccess={closeAuthModal}
                      onForgotPassword={() => openAuthModal('forgot-password')}
                      onSignup={() => openAuthModal('signup')}
                    />
                  )}
                  {authModalMode === 'signup' && (
                    <SignupForm 
                      onSuccess={closeAuthModal}
                      onLogin={() => openAuthModal('login')}
                    />
                  )}
                  {authModalMode === 'forgot-password' && (
                    <ForgotPasswordForm 
                      onSuccess={() => openAuthModal('login')}
                      onBack={() => openAuthModal('login')}
                    />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
