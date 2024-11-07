import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3 text-red-500 p-4 text-center">
        <AlertCircle className="w-10 h-10" />
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};