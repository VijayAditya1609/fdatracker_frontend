import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  'Real-time compliance monitoring',
  'Advanced predictive analytics',
  'Comprehensive facility scoring',
  'Custom report builder',
  'AI-powered insights',
  'Global search capabilities'
];

export default function CTA() {
  return (
    <div className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-16 shadow-2xl sm:px-12 sm:py-24">
          <div className="relative lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="lg:pr-8">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Transform Your FDA Compliance Strategy
              </h2>
              <p className="mt-6 max-w-xl text-lg text-blue-100">
                Join industry leaders using FDA Tracker to streamline compliance, reduce risks, and make data-driven decisions.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-200" />
                    <span className="ml-2 text-sm text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-12 lg:mt-0 flex items-center justify-center">
              <div className="space-y-4">
                <a
                  href="/register"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <a
                  href="/demo"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Request Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}