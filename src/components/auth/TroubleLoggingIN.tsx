import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { api, headers } from '../../config/api'; // Adjust the import path as needed

export default function TroubleLoggingIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const formData = new URLSearchParams();
      formData.append('email', email);

      const response = await fetch(api.forgotPassword, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': headers.Accept
        },
        mode: 'cors',
        body: formData,
      });

      const responseText = await response.text();

      if (response.ok) {
        setAlert({
          type: 'success',
          message: responseText || 'Password reset link sent! Check your email.',
        });
        setEmail(''); // Clear the email field on success
      } else {
        setAlert({
          type: 'error',
          message: responseText || 'Failed to send reset link. Please try again.',
        });
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-2xl font-bold text-white text-center">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-400 text-center">
          Enter your email to receive a password reset link.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-700">
          {alert && (
            <div
              className={`mb-6 p-4 rounded-md ${
                alert.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
              role="alert"
            >
              <div className="font-medium">
                {alert.type === 'success' ? 'Success' : 'Error'}
              </div>
              <div className="mt-1 text-sm">
                {alert.message}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm font-medium text-blue-500 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}