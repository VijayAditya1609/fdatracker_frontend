import React from 'react';
import { ClipboardCheck, BarChart3, Building2, Users2, Search, Brain, FileWarning, Scale, Factory } from 'lucide-react';

const features = [
  {
    name: 'Comprehensive Compliance Tracking',
    description: 'Monitor Form 483s, Warning Letters, EIRs, and Compliance Actions in one unified platform.',
    icon: ClipboardCheck,
  },
  {
    name: 'Advanced Analytics',
    description: 'Deep analysis of FDA Six Systems, trending subsystems, and predictive compliance insights.',
    icon: BarChart3,
  },
  {
    name: 'Company Intelligence',
    description: 'Detailed analysis of facilities, products, and comprehensive benchmarking against competitors.',
    icon: Building2,
  },
  {
    name: 'Investigator Insights',
    description: 'Track and analyze FDA investigator patterns, history, and inspection approaches.',
    icon: Users2,
  },
  {
    name: 'Global Search & AI',
    description: 'Powerful search capabilities and AI-powered chatbot for instant compliance insights.',
    icon: Search,
  },
  {
    name: 'Predictive Analytics',
    description: 'Calculate probability of 483 to Warning Letter conversion and identify repeat observations.',
    icon: Brain,
  },
  {
    name: 'Custom Reports',
    description: 'Build and customize reports for specific compliance and analysis needs.',
    icon: FileWarning,
  },
  {
    name: 'Facility Scoring',
    description: 'Comprehensive facility risk scoring and performance tracking system.',
    icon: Scale,
  },
  {
    name: 'Drug Manufacturing Intel',
    description: 'Track drug manufacturing, new approvals, and shortage information.',
    icon: Factory,
  },
];

export default function Features() {
  return (
    <div className="bg-gray-800/50 py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400">Comprehensive Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need for FDA compliance
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-6 w-6 flex-none text-blue-400" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}