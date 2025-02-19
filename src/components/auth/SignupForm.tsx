import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../landing/Logo';
import { api } from '../../config/api';
import {
  Loader2,
  FileSearch,
  AlertTriangle,
  UserCheck,
  Building2,
  ClipboardCheck,
  LineChart,
  TrendingUp,
  Bell,
  BarChart3,
  Search,
  CheckCircle2,
  Shield,
  Mail
} from 'lucide-react';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  password: string;
  'g-recaptcha-response'?: string;
}

interface ModalProps {
  isVisible: boolean;
  message: string;
  isVerified: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, message, isVerified, onClose }) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white text-center">Registration Successful!</h2>
        <p className="mt-3 text-sm text-gray-300 text-center">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              navigate('/');
              onClose();
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: initialEmail,
    designation: '',
    password: '',
  });

  const mainFeatures = [
    {
      title: "Conduct FDA 483 & Warning letter Analysis",
      highlight: "and Uncover Trends Instantly"
    },
    {
      title: "Simplify Audit Preparation with History &",
      highlight: "Trend Analysis"
    },
    {
      title: "Receive Real-Time Alerts for Instant FDA",
      highlight: "Updates"
    },
    {
      title: "Access Detailed FDA Investigator Profiles",
      highlight: "Effortlessly"
    }
  ];
  

  const FeatureCard: React.FC<{ title: string; highlight: string }> = ({ title, highlight }) => (
    <div className="bg-[#1C2333] bg-opacity-40 border border-[#20489E] rounded-2xl px-4 py-3 relative overflow-hidden max-w-md " 
         style={{
           background: 'linear-gradient(180deg, rgba(28,35,51,0.4) 0%, rgba(28,35,51,0.3) 100%)'
         }}>
      <div className="flex flex-col gap-1">
        <span className="text-[#d2e0fe] font-medium">{title}</span>
        <span className="text-[#4B9EFA] font-medium">{highlight}</span>
      </div>
    </div>
  );

  // Load reCAPTCHA script
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

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6Lc9ktMqAAAAAL7tiKaCfrUr2NkaMgrlsoKsCgJN';
    script.async = true;
    script.defer = true;
    script.onload = loadRecaptcha;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null); // Clear any previous errors when the user makes changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!recaptchaReady || !window.grecaptcha) {
        throw new Error('reCAPTCHA is not loaded yet. Please try again.');
      }

      // Execute reCAPTCHA and get token
      const recaptchaToken = await window.grecaptcha.execute('6Lc9ktMqAAAAAL7tiKaCfrUr2NkaMgrlsoKsCgJN', { action: 'signup' });

      // Add reCAPTCHA token to form data
      const signupData = {
        ...formData,
        'g-recaptcha-response': recaptchaToken
      };

      const response = await fetch(api.signup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsModalVisible(true);
        pollVerificationStatus();
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pollVerificationStatus = async () => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${api.observationDetail}?token=${token}`);
        const data = await response.json();
        if (data.verified) {
          clearInterval(interval);
          setIsVerified(true);
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        console.error("Error checking verification status:", err);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* left Section - Features */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full p-4 sm:p-6 lg:p-8">

      <div className="mb-8">
        <Link to="/" className="inline-block">
          <div className="w-32">
            <Logo />
          </div>
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-white mb-10 leading-tight max-w-xl">
        Access FDA 483 Trends & <br /> Analysis For Free
      </h1>

      <div className="flex flex-col space-y-3 mb-8" style={{ maxWidth: '520px' }}>
        {mainFeatures.map((feature, index) => (
          <FeatureCard key={index} title={feature.title} highlight={feature.highlight} />
        ))}
        
        <div className="flex items-center space-x-2 text-sm text-gray-400 mt-6 pt-6">
          <Shield className="w-4 h-4" />
          <span>Trusted by 1000+ pharma professionals</span>
        </div>
      </div>
    </div>

        {/* Additional Features
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="rounded-full bg-blue-500/10 p-2">
                  <feature.icon className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-white">{feature.title}</h3>
              </div>
              <ul className="ml-10 space-y-2">
                {feature.points.map((point, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div> */}

        {/* Trust Section */}
        {/* <div className="mt-6 lg:mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-400">Trusted by 7500+ pharma professionals</span>
            </div>
          </div>
        </div> */}
      {/* </div> */}
      
      {/* Right Section - Sign Up Form */}
      <div className="w-full lg:w-1/2 bg-gray-900 min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">


        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full px-4">


          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                required
                value={formData.designation}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !recaptchaReady}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Signing up...
                </>
              ) : (
                'Create free account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/" className="text-blue-500 hover:text-blue-400">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>

      <Modal
        isVisible={isModalVisible}
        message="Please check your email to verify your account."
        isVerified={isVerified}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default SignupForm;