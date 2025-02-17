import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../config/api';
import Alert from '../common/Alert';
import Logo from '../landing/Logo';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const response = await fetch(`${api.signupVerify}?token=${token}`, {
          method: 'GET',
        });

        if (response.ok) {
          setStatus('success');
          setMessage('Email verified successfully! You can now login.');
          // Auto-redirect after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Failed to verify email. The link may be invalid or expired.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* FDA Tracker Logo */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center text-white hover:text-gray-200">
          <Logo />
        </Link>
      </div>

        <h2 className="text-center text-3xl font-extrabold text-white mb-6">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-white">Verifying your email...</div>
            </div>
          )}
          
          {(status === 'success' || status === 'error') && (
            <>
              <Alert
                type={status}
                message={message}
              />
              {status === 'success' && (
                <div className="mt-4 text-center text-sm text-gray-400">
                  Redirecting to login page in 3 seconds...
                </div>
              )}
              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Go to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Having trouble? Contact{' '}
            <a href="mailto:support@fdatracker.com" className="text-blue-500 hover:text-blue-400">
            fdatracker@leucine.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 