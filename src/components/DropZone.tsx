import React from "react";
import { Upload } from "react-feather";

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
      className={`border-4 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out transform ${
        isDragging
          ? "border-indigo-500 bg-indigo-50 scale-105"
          : "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <Upload
          className={`w-20 h-20 ${
            isDragging ? "text-indigo-500" : "text-gray-400"
          } transition-colors duration-300`}
        />
        <div className="text-center">
          <p className="text-xl font-medium text-gray-700">
            Drag and drop your PDF here
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
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300 cursor-pointer"
        >
          Select File
        </label>
      </div>
    </div>
  );
};
