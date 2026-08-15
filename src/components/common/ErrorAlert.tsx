import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start justify-between gap-3 my-3">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-500 hover:text-red-800">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
