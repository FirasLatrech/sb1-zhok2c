import React, { useState, useCallback, useEffect } from "react";
import { DropZone } from "./DropZone";
import { ImagePreview } from "./ImagePreview";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorDisplay } from "./ErrorDisplay";
const BASE_URL = "https://e4fb-196-203-25-82.ngrok-free.app/";
const API_URL = `${BASE_URL}api/scan/upload-and-process-image`;

const ImageUpload: React.FC = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (originalImage) {
                URL.revokeObjectURL(originalImage);
            }
        };
    }, [originalImage]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
        },
        []
    );

    const handleFile = async (file: File) => {
        if (!file || !file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            setError("File size exceeds 10MB limit.");
            return;
        }

        try {
            setError(null);
            setIsUploading(true);
            setProcessedImage(null);

            const objectUrl = URL.createObjectURL(file);
            setOriginalImage(objectUrl);

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.detail?.[0]?.msg ||
                        `Server error: ${response.status}`
                );
            }

            const result = await response.json();

            const newUrl = result.image_url.replace(
                "http://localhost:8000/",
                BASE_URL
            );
            setProcessedImage(newUrl);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to process image. Please try again."
            );
            if (originalImage) URL.revokeObjectURL(originalImage);
            setOriginalImage(null);
        } finally {
            setIsUploading(false);
        }
    };

    const resetUpload = useCallback(() => {
        if (originalImage) URL.revokeObjectURL(originalImage);
        setOriginalImage(null);
        setProcessedImage(null);
        setError(null);
    }, [originalImage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Document Scanner
                    </h1>

                    {!originalImage ? (
                        <DropZone
                            isDragging={isDragging}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onFileSelect={handleFileInput}
                        />
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ImagePreview
                                    title="Original Image"
                                    imageSrc={originalImage}
                                    onReset={resetUpload}
                                    showResetButton={true}
                                />

                                <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-gray-100">
                                    {isUploading ? (
                                        <LoadingSpinner />
                                    ) : error ? (
                                        <ErrorDisplay message={error} />
                                    ) : processedImage ? (
                                        <div className="relative h-full">
                                            <div className="absolute top-4 left-4 z-10 bg-white/90 px-3 py-2 rounded-lg shadow-md">
                                                <h2 className="text-lg font-semibold text-gray-700">
                                                    Processed Image
                                                </h2>
                                            </div>
                                            <img
                                                src={processedImage}
                                                alt="Processed"
                                                className="w-full h-full object-contain"
                                                onError={() => {
                                                    setError(
                                                        "Failed to load processed image"
                                                    );
                                                }}
                                            />
                                            <div className="absolute bottom-4 right-4">
                                                <a
                                                    href={processedImage}
                                                    download="processed-image.jpg"
                                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Supported formats: JPG, PNG, GIF</p>
                    <p className="mt-1">Maximum file size: 10MB</p>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
