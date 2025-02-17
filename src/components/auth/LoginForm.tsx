import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../landing/Logo';
import { Loader2 } from 'lucide-react';
import Alert from '../common/Alert';
import { auth } from '../../services/auth';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  email: string;
  password: string;
}

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [recaptchaReady, setRecaptchaReady] = useState(false);

  // Load reCAPTCHA dynamically
  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          console.log('reCAPTCHA loaded successfully');
          setRecaptchaReady(true);
        });
      } else {
        console.error('Failed to load reCAPTCHA.');
      }
    };

    // Dynamically add reCAPTCHA script
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6Lc9ktMqAAAAAL7tiKaCfrUr2NkaMgrlsoKsCgJN';
    script.async = true;
    script.defer = true;
    script.onload = loadRecaptcha;

    document.head.appendChild(script);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      if (!recaptchaReady || !window.grecaptcha) {
        throw new Error('reCAPTCHA is not loaded yet. Please try again.');
      }

      // Execute reCAPTCHA and get token
      const recaptchaToken = await window.grecaptcha.execute('6Lc9ktMqAAAAAL7tiKaCfrUr2NkaMgrlsoKsCgJN', { action: 'login' });

      // Send login request with reCAPTCHA token
      await auth.login(formData.email, formData.password, recaptchaToken);

      // Get the token and user data
      const token = auth.getToken() as string;
      login(token);

      setAlert({
        type: 'success',
        message: 'Login successful! Redirecting...',
      });

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      setAlert({
        type: 'error',
        message: err instanceof Error ? err.message : 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center text-white hover:text-gray-200">
          <Logo />
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto w-full sm:max-w-md">
        <div className="bg-gray-800 py-6 px-4 sm:py-8 sm:px-10 shadow-xl rounded-lg border border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">Welcome</h2>
            <p className="mt-2 text-sm text-gray-400 text-center">
              Sign in to your FDA Tracker account
            </p>
          </div>

          {alert && (
            <div className="mb-6">
              <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
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
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2.5 text-sm text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2.5 text-sm text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/trouble-logging-in" className="text-sm font-medium text-blue-500 hover:underline hover:text-blue-400">
                Having trouble signing in?
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">New to FDA Tracker?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to={`/signup?email=${formData.email}`}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
