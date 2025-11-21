"use client";
import React, { useState } from "react";
import { Upload, X, FileImage, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function PestManagement() {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🔑 Gemini API Key
  const API_KEY = "AIzaSyCGkh3g_A_HvBtRNQ2q2WGxS3LP2Sqtko0";

  // 📤 Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // 🖱 Drag & Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  // ❌ Remove image
  const removeImage = () => {
    setImage(null);
    setResult(null);
  };

  // 🔍 Analyze image using Gemini 1.5 Flash (Vision)
  const analyzeImage = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const base64Data = image.split(",")[1];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an expert in crop and plant disease detection.
                    When analyzing an image:
                    - If it is NOT a valid crop, plant, or leaf, respond exactly:
                      "Invalid image. Please upload a valid crop or leaf image."
                    - If it is valid, analyze and respond in *markdown format* with:
                      ## Disease Name
                      ## Cause of Disease
                      ## Suggested Treatment or Solution
                      Include bullet points for treatments.`,
                  },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini API response:", data);

      const outputText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No analysis result found.";

      setResult(outputText);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🖼 UI
  return (
    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-6 w-full min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            🌿 Crop & Leaf Disease Detector
          </h1>
          <p className="text-gray-600">
            Upload a crop or leaf image to detect possible diseases and get treatment suggestions.
          </p>
        </div>

        {/* Upload Section */}
        <div
          className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ${
            isDragging ? "ring-4 ring-emerald-400 scale-105" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!image ? (
            <label className="flex flex-col items-center justify-center h-80 cursor-pointer">
              <div className="flex flex-col items-center justify-center p-8">
                <div className="p-6 bg-emerald-100 rounded-full mb-6">
                  <Upload className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  Drop your image here
                </h3>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <div className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition">
                  Select Image
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative h-96">
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-white text-lg font-medium flex items-center">
                  <FileImage className="w-5 h-5 mr-2" />
                  Image uploaded successfully
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        {image && (
          <div className="text-center mt-6">
            <button
              onClick={analyzeImage}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-full hover:from-green-700 hover:to-emerald-800 transition flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Image"
              )}
            </button>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="mt-8 bg-white shadow-lg rounded-3xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-emerald-800 mb-3">
              🧠 Analysis Result
            </h2>
            <div className="prose prose-green max-w-none">
              <ReactMarkdown
                components={{
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-bold text-emerald-700 mt-4 mb-2"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="text-emerald-800" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-6 list-disc text-gray-700" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-gray-700 mb-2" {...props} />
                  ),
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}