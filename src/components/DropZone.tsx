import React from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`border-4 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out ${
        isDragging
          ? 'border-indigo-400 bg-indigo-50'
          : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <Upload
          className={`w-16 h-16 ${
            isDragging ? 'text-indigo-500' : 'text-gray-400'
          }`}
        />
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700">
            Drag and drop your image here
          </p>
          <p className="text-sm text-gray-500 mt-2">
            or click to browse from your computer
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 cursor-pointer"
        >
          Select Image
        </label>
      </div>
    </div>
  );
};