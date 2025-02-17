import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  const bgColor = type === 'success' ? 'bg-green-400/10' : 'bg-red-400/10';
  const borderColor = type === 'success' ? 'border-green-400/20' : 'border-red-400/20';
  const textColor = type === 'success' ? 'text-green-400' : 'text-red-400';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Icon className="h-5 w-5 mr-2" />
          <span>{message}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}