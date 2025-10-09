'use client';

import { BookOpen, Lightbulb, Users, TrendingUp, Clock, ArrowRight } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#101418] rounded-full mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#101418] mb-4">
            Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive hub for career development, job search tips, and professional growth resources
          </p>
        </div>

        {/* Coming Soon Illustration */}
        <div className="relative mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            {/* Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#101418] to-gray-700 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Clock className="w-16 h-16 text-white animate-pulse" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -bottom-2 -left-6 w-6 h-6 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-8 -left-8 w-4 h-4 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <h2 className="text-3xl font-bold text-[#101418] mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're crafting an amazing collection of resources to help you excel in your career journey. 
              Get ready for expert insights, practical tips, and valuable tools.
            </p>

            {/* Progress indicator */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-[#101418] h-2 rounded-full w-3/4 animate-pulse"></div>
            </div>
            <p className="text-sm text-gray-500">Development in progress...</p>
          </div>
        </div>

        {/* What to Expect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Career Tips</h3>
            <p className="text-gray-600">
              Expert advice on resume writing, interview preparation, networking strategies, and career advancement techniques.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Industry Insights</h3>
            <p className="text-gray-600">
              Stay updated with the latest trends, salary guides, market analysis, and industry-specific career paths.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-[#101418] mb-4">Professional Development</h3>
            <p className="text-gray-600">
              Skill-building resources, certification guides, mentorship programs, and leadership development materials.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-[#101418] to-gray-800 rounded-3xl p-12 text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-lg mb-8 opacity-90">
            Be the first to know when our resources are ready. Follow us for updates and exclusive early access.
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
