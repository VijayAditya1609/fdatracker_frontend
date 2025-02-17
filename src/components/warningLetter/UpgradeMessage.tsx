import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpgradeMessage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg mx-auto text-center">
      <div className="bg-blue-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <TrendingUp className="h-8 w-8 text-blue-500" />
      </div>
      
      <h2 className="text-2xl font-semibold text-white mb-4">
        Daily Limit Reached
      </h2>
      
      <p className="text-gray-400 mb-8">
        You have reached your daily viewing limit for Warning Letter details. 
        Upgrade to our Elite plan to get unlimited access to Warning Letters, 
        advanced analytics, and more features.
      </p>
      
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/subscription')}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Upgrade to Elite
        </button>
        
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UpgradeMessage;