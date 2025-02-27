import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning';
  message: string;
  onClose?: () => void;
}

export default function Alert({ type, message, onClose }: AlertProps) {
  let bgColor, borderColor, textColor, Icon;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-400/10';
      borderColor = 'border-green-400/20';
      textColor = 'text-green-400';
      Icon = CheckCircle;
      break;
    case 'warning':
      bgColor = 'bg-yellow-400/10';
      borderColor = 'border-yellow-400/20';
      textColor = 'text-yellow-400';
      Icon = AlertTriangle;
      break;
    case 'error':
    default:
      bgColor = 'bg-red-400/10';
      borderColor = 'border-red-400/20';
      textColor = 'text-red-400';
      Icon = AlertCircle;
  }

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