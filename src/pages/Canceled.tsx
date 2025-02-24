import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { authFetch } from "../services/authFetch";
import { api } from "../config/api";

const stripePromise = loadStripe("pk_live_51O1KlFGzSCaeO8GuyDU6FCasEFahkJMJSrsR21ZfyqDvjnYNjRYHViWu3KwCAR54QcWatqZXWmoFloU38MHlxk0H00z2xvt17o");

export default function Canceled() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log("Payment was canceled.");
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRetryUpgrade = async () => {
    try {
      const priceId = "price_1Qw3qgGzSCaeO8Gu9NEC202y";
      const response = await authFetch(api.createCheckoutSession, {
        method: "POST",
        body: JSON.stringify({ priceId }),
      });
      
      const data = await response.json();
      const stripe = await stripePromise;
      const { sessionId } = data;

      if (!stripe) {
        console.error("Stripe.js failed to load.");
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Error redirecting to Stripe Checkout:", error);
      }
    } catch (error) {
      console.error("Error making request to backend:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col items-center justify-center min-h-full p-4 bg-gray-900">
        <div className="flex flex-col items-center justify-center w-full max-w-lg text-center">
          <XCircle className="text-red-500" size={64} />
          <h1 className="text-3xl font-semibold text-white mt-4">Payment Canceled</h1>
          <p className="mt-2 text-gray-400">
            Your payment was not completed. Please try again or contact support if you need assistance.
          </p>
          
          <div className="mt-8 w-full max-w-md">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
              <h3 className="text-xl font-semibold text-white">Elite Plan</h3>
              <p className="mt-2 text-gray-400">Advanced features for Elite users</p>
              <p className="mt-4">
                <span className="text-3xl font-bold text-white">$50</span>
                <span className="text-gray-400 ml-2">/month</span>
              </p>
            </div>
            
            <button
              onClick={handleRetryUpgrade}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-3 
                        transition-colors focus:outline-none focus:ring-2 
                        focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Try Again
            </button>
            
            <a
              href="/dashboard"
              className="block text-center mt-4 text-gray-400 hover:text-white transition-colors"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}