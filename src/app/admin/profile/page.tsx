'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/components/custom/Toast';
import { 
  User, 
  Mail, 
  Calendar, 
  Loader2, 
  Check, 
  Lock, 
  Eye, 
  EyeOff,
  Shield,
  UserCircle,
  Edit3,
  Briefcase
} from 'lucide-react';
import { formatDate } from '@/lib/date';

export default function AdminProfilePage() {
  const { admin, loading: authLoading, updatePassword, refreshAdmin } = useAdminAuth();
  const toast = useToast();

  // Basic info form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Initialize form with admin data
  useEffect(() => {
    if (admin) {
      setFirstName(admin.first_name || '');
      setLastName(admin.last_name || '');
    }
  }, [admin]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;

    setSavingProfile(true);
    try {
      const response = await fetch(`/api/admins/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile updated', 'Your information has been saved successfully.');
        await refreshAdmin();
      } else {
        toast.error('Update failed', data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Update failed', `${error}: An unexpected error occurred`);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Validation error', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Validation error', 'Passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        toast.error('Update failed', error.message);
      } else {
        toast.success('Password updated', 'Your password has been changed successfully.');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error('Update failed', `${error}: An unexpected error occurred`);
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-teal-600 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-500 text-sm animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-teal-600 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-500 text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account information and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Admin Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-8 text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto">
                  <UserCircle className="w-16 h-16 text-slate-700" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <Edit3 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-white mt-4">
                {admin.first_name} {admin.last_name}
              </h2>
              <p className="text-white/70 text-sm mt-1">{admin.email}</p>
            </div>

            {/* Admin Details */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                  <p className="text-sm font-medium text-slate-900 truncate">{admin.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Role</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatRole(admin.role)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Member Since</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDate(admin.created_at, 'long')}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Account Status</span>
                  <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-slate-500">Role</span>
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(admin.role)}`}>
                    {formatRole(admin.role)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
                  <p className="text-sm text-slate-500">Update your personal details</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={admin.email}
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">Email cannot be changed</p>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    value={formatRole(admin.role)}
                    disabled
                    className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">Contact a super admin to change your role</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center px-5 py-3 bg-teal-600 text-xs text-white rounded-xl font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Security</h3>
                  <p className="text-sm text-slate-500">Update your password to keep your account secure</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        minLength={6}
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        minLength={6}
                        className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all text-slate-900 placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">Password Requirements</p>
                  <ul className="text-sm text-slate-500 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      At least 6 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${newPassword && newPassword === confirmPassword ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      Passwords match
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword || !newPassword || !confirmPassword}
                  className="inline-flex items-center px-5 py-3 bg-amber-500 text-xs text-white rounded-xl font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
