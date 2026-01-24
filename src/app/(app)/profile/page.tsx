'use client';

import { User, Settings, Bell, Heart, Star, Shield, Clock, ArrowRight, UserCheck, Briefcase, Award } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#101418] rounded-full mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#101418] mb-4">
            Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal dashboard for managing your career, applications, and professional journey
          </p>
        </div>

        {/* Coming Soon Illustration */}
        <div className="relative mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            {/* Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#101418] to-gray-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <UserCheck className="w-16 h-16 text-white animate-pulse" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-8 -left-8 w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <h2 className="text-3xl font-bold text-[#101418] mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're building your personal career command center. Get ready for a comprehensive profile 
              that tracks your journey and helps you land your dream job.
            </p>

            {/* Progress indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-[#101418] h-2 rounded-full w-2/3 animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500">Development in progress...</p>
          </div>
        </div>

        {/* What to Expect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Application Tracker</h3>
            <p className="text-gray-600">
              Keep track of all your job applications, interview stages, and follow-ups in one organized dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Skills & Achievements</h3>
            <p className="text-gray-600">
              Showcase your skills, certifications, and professional achievements with a comprehensive portfolio.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Saved Jobs</h3>
            <p className="text-gray-600">
              Save and organize your favorite job postings, set alerts for similar positions, and never miss an opportunity.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Career Goals</h3>
            <p className="text-gray-600">
              Set and track your career objectives, milestones, and progress toward your professional aspirations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
              <Bell className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Smart Notifications</h3>
            <p className="text-gray-600">
              Get personalized alerts for new job matches, application updates, and career opportunities tailored to you.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Privacy Controls</h3>
            <p className="text-gray-600">
              Control your visibility, manage your data, and customize your privacy settings to match your preferences.
            </p>
          </div>
        </div>

        {/* Additional Features Preview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#101418] mb-4">More Features Coming</h3>
            <p className="text-gray-600">We're working on even more ways to enhance your career journey</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#101418]">Customizable Dashboard</h4>
                <p className="text-sm text-gray-600">Personalize your experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#101418]">Professional Network</h4>
                <p className="text-sm text-gray-600">Connect with industry peers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#101418]">Career Analytics</h4>
                <p className="text-sm text-gray-600">Track your progress and growth</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-[#101418]">Recommendations</h4>
                <p className="text-sm text-gray-600">AI-powered career insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-[#101418] to-gray-800 rounded-3xl p-12 text-white">
          <h3 className="text-2xl font-bold mb-4">Be the First to Know</h3>
          <p className="text-lg mb-8 opacity-90">
            Get early access to your personalized profile dashboard. Follow us for updates and exclusive previews.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="https://www.instagram.com/wearetechx/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white text-[#101418] rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              Follow on Instagram
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a 
              href="https://linkedin.com/company/wearetechx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
            >
              Connect on LinkedIn
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
