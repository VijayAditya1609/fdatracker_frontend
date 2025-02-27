import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import Navbar from '../components/dashboard/Navbar';
import Sidebar from '../components/dashboard/Sidebar';

export default function Canceled() {
  useEffect(() => {
    // Optionally, you can add analytics tracking or other side effects
    console.log("Payment was canceled.");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Sidebar />

      <div className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8 text-center">
            <XCircle className="text-red-500 mx-auto" size={64} />
            <h1 className="text-3xl font-semibold text-white mt-4">Payment Canceled</h1>
            <p className="mt-2 text-gray-400">Your payment was not completed. Please try again or contact support if you need assistance.</p>
            <div className="mt-8">
              <a
                href="/subscription"  // Link to the subscription page or homepage
                className="bg-gray-700 text-white rounded-md px-6 py-3 
                           hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 
                           focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Try Again
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
