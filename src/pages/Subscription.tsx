import React from "react";
import { Check } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { api } from "../config/api";
import { loadStripe } from "@stripe/stripe-js";
import { auth } from "../services/auth";
import { useAuth } from "../contexts/AuthContext"; // Add this import
import { authFetch } from "../services/authFetch";


const stripePromise = loadStripe("pk_live_51O1KlFGzSCaeO8GuyDU6FCasEFahkJMJSrsR21ZfyqDvjnYNjRYHViWu3KwCAR54QcWatqZXWmoFloU38MHlxk0H00z2xvt17o");

export default function Subscription() {
  const { user } = useAuth(); // Get user from auth context

  const handleUpgrade = async (plan: string) => {
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

  // Determine button content and styles based on subscription status
  const renderPlanButton = (planType: 'free' | 'elite') => {
    const isSubscribed = user?.isSubscribed;
    
    if (planType === 'free') {
      return (
        <button
          disabled={!isSubscribed}
          className={`mt-8 w-full ${
            !isSubscribed 
              ? 'bg-gray-700 text-white' 
              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
          } rounded-md px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
        >
          {!isSubscribed ? 'Current Plan' : 'Basic Plan'}
        </button>
      );
    }

    if (planType === 'elite') {
      return (
        <button
          onClick={() => !isSubscribed && handleUpgrade("elite")}
          className={`mt-8 w-full ${
            isSubscribed 
              ? 'bg-blue-500 cursor-default' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-md px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
        >
          {isSubscribed ? 'Current Plan' : 'Upgrade Now'}
        </button>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white">Subscription Plans</h1>
            <p className="mt-2 text-gray-400">Choose the plan that best fits your needs</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Free Plan */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">Free Plan</h3>
                <p className="mt-2 text-gray-400">Perfect for getting started</p>
                <p className="mt-4">
                  <span className="text-3xl font-bold text-white">$0</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </p>
                {renderPlanButton('free')}
              </div>
            </div>

            {/* Elite Plan */}
            <div className="bg-gray-800 rounded-lg border border-blue-500 shadow-lg relative">
              <div className="absolute -top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Recommended
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">Elite Plan</h3>
                <p className="mt-2 text-gray-400">Advanced features for Elite users</p>
                <p className="mt-4">
                  <span className="text-3xl font-bold text-white">$50</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </p>
                {renderPlanButton('elite')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}