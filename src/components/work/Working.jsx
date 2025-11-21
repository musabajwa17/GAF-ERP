"use client";

import { useState } from "react";
import { Play, X, Sparkles } from "lucide-react";

export default function Working() {
  const listItems = [
    "Protect Enhance Environment for future generations",
    "EcoSystems are imperative to maintaining a health planet",
    "Help protect the Environment and sustain its natural resources",
  ];

  const [videoOpen, setVideoOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-green-50 w-full pt-16 pb-20 px-5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-16 relative z-10">
        {/* Image Section with Enhanced Styling */}
        <div className="w-full lg:w-5/12 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
          
          <div className="relative">
            <img
              src="/image1.jpg"
              alt="Eco Planet"
              className="rounded-2xl shadow-2xl w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-2xl"></div>

            {/* Enhanced Play Button */}
            <button
              onClick={() => setVideoOpen(true)}
              className="cursor-pointer absolute bottom-6 sm:bottom-10 right-0 flex justify-center items-center bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 sm:px-7 py-4 sm:py-5 rounded-tl-3xl rounded-bl-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group/btn"
            >
              <div className="relative">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current animate-pulse" />
                <div className="absolute inset-0 bg-white rounded-full blur opacity-50 group-hover/btn:opacity-75 transition-opacity"></div>
              </div>
              <div className="ml-4 text-left flex flex-col">
                <span className="text-base sm:text-lg lg:text-xl font-bold tracking-wide">Want to Watch</span>
                <span className="text-base sm:text-lg lg:text-xl font-bold tracking-wide">How we work</span>
              </div>
            </button>

            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-green-400 rounded-tl-2xl opacity-60"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl opacity-60"></div>
          </div>

          {/* Video Modal */}
          {videoOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-300">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl w-[95%] h-[70%] sm:w-4/5 sm:h-3/4 lg:w-3/4 lg:h-3/4 relative shadow-2xl transform animate-in zoom-in-95 duration-300">
                <button
                  onClick={() => setVideoOpen(false)}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-6 h-6" />
                </button>
                <iframe
                  className="w-full h-full rounded-2xl"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Content Section with Enhanced Typography */}
        <div className="w-full lg:w-6/12 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-green-500 animate-pulse" />
            <span className="text-green-600 font-semibold text-sm tracking-widest uppercase">Our Mission</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 mb-6 leading-tight"
            style={{ fontFamily: 'Inter, Arial, Helvetica, sans-serif' }}
          >
            We Are Taking Small Steps To Make Earth Better Planet
          </h2>

          {/* Animated divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"></div>
            <div className="h-1 w-8 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full"></div>
          </div>

          <ul className="space-y-5 my-5">
            {listItems.map((item, index) => (
              <li
                key={item}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex items-start gap-4 cursor-pointer group/item transform transition-all duration-300 hover:translate-x-2"
              >
                <span className={`flex items-center justify-center min-w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-lg shadow-md transition-all duration-300 ${
                  hoveredIndex === index ? 'scale-110 shadow-lg' : ''
                }`}>
                  ›
                </span>
                <span className={`text-gray-700 group-hover/item:text-gray-900 text-base sm:text-lg font-medium leading-relaxed transition-all duration-300 ${
                  hoveredIndex === index ? 'font-semibold' : ''
                }`}>
                  {item}
                </span>
              </li>
            ))}
          </ul>

          {/* Additional decorative element */}
          <div className="mt-8 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-bounce delay-100"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}