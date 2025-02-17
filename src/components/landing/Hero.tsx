import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="md:max-w-2xl lg:col-span-6">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Streamline Your FDA Compliance & Analysis
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Comprehensive FDA compliance tracking, analysis, and insights platform. Monitor Form 483s, Warning Letters, and facility performance with advanced analytics and predictive tools.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a href="/signup" className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white">
                View Features <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="FDA Tracker Dashboard"
                className="rounded-xl shadow-xl ring-1 ring-white/10"
              />
              <div className="absolute -bottom-6 -left-6 -right-6 -top-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}