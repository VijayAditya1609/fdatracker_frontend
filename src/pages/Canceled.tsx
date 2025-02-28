import React, { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { useAuth } from "../contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { authFetch } from "../services/authFetch";
import { api } from "../config/api";

const stripePromise = loadStripe("pk_live_51O1KlFGzSCaeO8GuyDU6FCasEFahkJMJSrsR21ZfyqDvjnYNjRYHViWu3KwCAR54QcWatqZXWmoFloU38MHlxk0H00z2xvt17o");

export default function Canceled() {
  const { user } = useAuth();

  useEffect(() => {
    console.log("Payment was canceled.");
  }, []);

  const handleRetryUpgrade = async () => {
    try {
      const priceId = "price_1Qw3qgGzSCaeO8Gu9NEC202y";
      const response = await authFetch(api.createCheckoutSession, {
        method: "POST",
        body: JSON.stringify({ priceId }),
      });
      
      const data = await response.json();
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe.js failed to load.");
        return;
      }
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error making request to backend:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
        <div className="text-center mb-10">
          <XCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-4xl font-extrabold mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Payment Canceled
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            Your payment was not completed. Please try again or contact support.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-gray-700 bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-blue-500/30 hover:scale-105 max-w-md w-full">
          <h3 className="text-xl font-bold text-white">🚀 Elite Plan</h3>
          <p className="mt-2 text-gray-400">Advanced features for Elite users</p>
          <div className="mt-4 text-4xl font-extrabold text-white">$50</div>
          <span className="text-gray-400 text-sm">per month</span>

          <button
            onClick={handleRetryUpgrade}
            className="mt-6 w-full rounded-lg py-3 font-semibold text-lg transition-all duration-300 shadow-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105"
          >
            Try Again 🔄
          </button>
          
          <a
            href="/dashboard"
            className="block text-center mt-4 text-gray-400 hover:text-white transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
