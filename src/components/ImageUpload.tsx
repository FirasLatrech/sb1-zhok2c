import React, { useState } from "react";

const API_URL = "https://grade.lissene.dev/api/grade-pdf-Img/upload-exam-pdf";
const API_KEY = "0747abf5-e899-47c7-a38a-c8a1ccc73822";

const ImageUpload: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [examGrade, setExamGrade] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate URL
    if (!pdfUrl.trim()) {
      setError("Please enter a valid PDF URL");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      setExamGrade(null);

      // Encode the URL and construct the full API URL
      const fullApiUrl = `${API_URL}?url=${encodeURIComponent(pdfUrl)}`;

      const response = await fetch(fullApiUrl, {
        method: "POST",
        headers: {
          "X-API-Key": `${API_KEY}`,
        },
      });

      if (!response.ok) {
        // Try to parse error response
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const result = await response.json();

      // Extract exam grade from the response
      if (result.results && result.results.length > 0) {
        setExamGrade(result.results[0].exam_grade);
      } else {
        setError("No grade found in the response");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to process PDF. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-indigo-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 ease-in-out transform hover:scale-105">
          <h1 className="text-4xl font-bold text-indigo-800 mb-8 text-center">
            Taki Academy - Exam Grade Scanner
          </h1>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleUrlSubmit} className="space-y-6">
              <div className="flex items-center border-2 border-indigo-300 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:border-indigo-500">
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="Enter PDF URL (Azure Blob Storage)"
                  className="flex-grow p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-indigo-600 text-white px-8 py-4 hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 rounded-lg"
                >
                  {isProcessing ? "Processing..." : "Get Grade"}
                </button>
              </div>
            </form>

            {isProcessing && (
              <div className="mt-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
                <p className="text-indigo-600 mt-3">Processing PDF...</p>
              </div>
            )}

            {error && (
              <div
                className="mt-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg transition-all duration-300 ease-in-out"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {examGrade && !isProcessing && (
              <div className="mt-6 text-center bg-indigo-50 border border-indigo-200 rounded-lg p-8 transition-all duration-300 ease-in-out transform hover:scale-105">
                <h2 className="text-3xl font-bold text-indigo-800 mb-4">
                  Exam Grade
                </h2>
                <div className="text-6xl font-extrabold text-indigo-600">
                  {examGrade}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-indigo-700">
          <p>Enter a direct URL to a PDF file from Azure Blob Storage</p>
          <p className="mt-1">Example: Taki Academy Exam PDFs</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
