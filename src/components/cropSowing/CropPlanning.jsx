export default function GrowerPlatform() {
  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/21711160/pexels-photo-21711160.jpeg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-15 min-h-screen flex items-center">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-full max-w-6xl mx-auto">
          {/* Left Side - Text Content */}
          <div className="text-white space-y-6 lg:space-y-8 w-full lg:w-2/3">
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
              Smart Farming Modules
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
              Access powerful tools for crop sowing, irrigation, weather forecasting, and labor management — all designed to optimize resources, reduce risks, and improve productivity across every stage of farming.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Login to Access Modules
            </button>
          </div>

          {/* Right Side placeholder */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            {/* Place your cards or right-side content here */}
          </div>
        </div>
      </div>
    </div>
  );
}
