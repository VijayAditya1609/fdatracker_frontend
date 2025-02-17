import React from 'react';
import { CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SubscriptionButton() {
  return (
    <Link
      to="/subscription"
      className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg"
    >
      <CreditCard className="h-4 w-4 mr-3" />
      My Subscription
    </Link>
  );
} 