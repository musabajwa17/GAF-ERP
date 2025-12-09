import React from 'react';
import { Sprout, Droplets, Wheat, Package } from 'lucide-react';

export default function Content() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-800 mb-3">
            What is CROP ERP?
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Crop ERP is a comprehensive, modular solution designed specifically for the nuanced needs of farmers around the globe.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Stage 01: Pre-Season
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4">(Planning & Preparation)</p>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Farmers prepare fields, soil, inputs, and agreements before sowing.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Crop ERP ensures accurate planning and cost control at this stage.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Stage 04: Post-Harvest
              </h2>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>Analyze cost per lot, post-harvest losses, and margins.</li>
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>Crop P&amp;L reports</li>
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>ROI dashboards</li>
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>Insurance/subsidy integration</li>
              </ul>
            </div>
          </div>

          {/* Center Clover Graphic */}
          <div className="flex items-center justify-center py-8 lg:py-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-green-800 rounded-full flex items-center justify-center">
                <Sprout className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 text-white" strokeWidth={1.5} />
              </div>

              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-green-700 rounded-full flex items-center justify-center">
                <Droplets className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 text-white" strokeWidth={1.5} />
              </div>

              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-700 rounded-full flex items-center justify-center">
                <Package className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 text-white" strokeWidth={1.5} />
              </div>

              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-800 rounded-full flex items-center justify-center">
                <Wheat className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 text-white" strokeWidth={1.5} />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl z-10">
                <img
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=400&fit=crop"
                  alt="Crop Field"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Stage 02: In-Season
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4">(Operations & Monitoring)</p>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>Farmers execute daily operations: planting, irrigation, labor, weather monitoring.</li>
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>ERP ensures efficiency, compliance, and lower costs.</li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Stage 03: Harvest Season
              </h2>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>Farmers convert crops into value: harvest, storage, logistics, and sales.</li>
                <li className="flex items-start"><span className="text-green-600 mr-2">•</span>ERP ensures efficiency, quality, and traceability.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
