import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import Logo from '../components/landing/Logo';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-12">
        <Logo />
      </div>

      <div className="text-center max-w-2xl">
        {/* 404 Header */}
        <h1 className="text-7xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Page Missing!</h2>
        
        {/* Description */}
        <p className="text-gray-400 mb-8">
        Oops! It looks like you don't have permission to access this page.
        Our team is on it, ensuring you're safely directed.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
} 