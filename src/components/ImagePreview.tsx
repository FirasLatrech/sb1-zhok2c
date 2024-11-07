import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  title: string;
  imageSrc: string | null;
  onReset?: () => void;
  showResetButton?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  title,
  imageSrc,
  onReset,
  showResetButton = false,
}) => {
  if (!imageSrc) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-contain bg-gray-100"
        />
        {showResetButton && onReset && (
          <button
            onClick={onReset}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};