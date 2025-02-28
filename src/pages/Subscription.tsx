import React from "react";
import { Check, Star } from "lucide-react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import { api } from "../config/api";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../contexts/AuthContext"; 
import { authFetch } from "../services/authFetch";

const stripePromise = loadStripe("pk_live_51O1KlFGzSCaeO8GuyDU6FCasEFahkJMJSrsR21ZfyqDvjnYNjRYHViWu3KwCAR54QcWatqZXWmoFloU38MHlxk0H00z2xvt17o");

export default function Subscription() {
  const { user } = useAuth(); 

  const handleUpgrade = async () => {
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

  // Dynamic button rendering based on user's subscription
  const renderPlanButton = (planType: "free" | "elite") => {
    const isSubscribed = user?.isSubscribed;

    if (planType === "free") {
      return (
        <button
          disabled
          className="mt-6 w-full bg-gray-700 text-gray-400 cursor-not-allowed rounded-lg py-3 font-semibold text-lg"
        >
          {isSubscribed ? "Basic Plan" : "Current Plan"}
        </button>
      );
    }

    if (planType === "elite") {
      return (
        <button
          onClick={() => !isSubscribed && handleUpgrade()}
          className={`mt-6 w-full rounded-lg py-3 font-semibold text-lg transition-all duration-300 shadow-md ${
            isSubscribed
              ? "bg-green-500 text-white cursor-default"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105"
          }`}
        >
          {isSubscribed ? "Current Plan" : "Upgrade Now 🚀"}
        </button>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Choose Your Plan
          </h1>
          <p className="mt-3 text-gray-400 text-lg">
            Unlock premium features and take your experience to the next level.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 max-w-4xl w-full">
          {/* Free Plan */}
          <div className="relative p-8 rounded-2xl border border-gray-700 bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-blue-500/30 hover:scale-105">
            <h3 className="text-xl font-bold text-white">🌟 Free Plan</h3>
            <p className="mt-2 text-gray-400">Get started with basic features</p>
            <div className="mt-4 text-4xl font-extrabold text-white">$0</div>
            <span className="text-gray-400 text-sm">per month</span>

            {/* Features List */}
            <ul className="mt-5 space-y-3 text-gray-300">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Access to basic features
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Limited usage
              </li>
            </ul>

            {/* Render Plan Button */}
            {renderPlanButton("free")}
          </div>

          {/* Elite Plan */}
          <div className="relative p-8 rounded-2xl border border-blue-500 bg-gradient-to-b from-blue-800 to-gray-900 shadow-lg transition-all duration-300 hover:shadow-purple-500/30 hover:scale-105">
            <div className="absolute -top-4 right-4 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-300" /> Premium
            </div>

            <h3 className="text-xl font-bold text-white">🚀 Elite Plan</h3>
            <p className="mt-2 text-gray-400">Unlock all premium features</p>
            <div className="mt-4 text-4xl font-extrabold text-white">$50</div>
            <span className="text-gray-400 text-sm">per month</span>

            {/* Features List */}
            <ul className="mt-5 space-y-3 text-gray-300">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Full access to all features
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Priority support
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Faster processing
              </li>
            </ul>

            {/* Render Plan Button */}
            {renderPlanButton("elite")}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}