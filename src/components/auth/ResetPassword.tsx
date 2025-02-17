import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../../services/auth';
import { Loader2 } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await auth.resetPassword(token, password, confirmPassword);
      setMessage(response);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-700">
            <div className="text-center text-red-500 mb-4">
              Invalid or expired reset token. Please request a new password reset link.
            </div>
            <div className="text-center">
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-medium text-blue-500 hover:underline"
              >
                Request New Reset Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-2xl font-bold text-white text-center">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-400 text-center">
          Please enter your new password below
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-700">
          {(message || error) && (
            <div
              className={`mb-6 p-4 rounded-md ${
                message ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
              role="alert"
            >
              <div className="font-medium">
                {message ? 'Success' : 'Error'}
              </div>
              <div className="mt-1 text-sm">
                {message || error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-400 text-center">
          Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;