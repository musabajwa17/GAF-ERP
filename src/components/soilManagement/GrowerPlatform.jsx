export default function GrowerPlatform() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover object-center"
      >
        <source src="https://agrierp.com/wp-content/uploads/2025/06/growers-management-video.webm" type="video/webm" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-15 min-h-screen flex items-center">
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-full max-w-6xl mx-auto ">
          
          {/* Left Side - Text Content (responsive: full width on small, 1/2 on lg+) */}
          <div className="text-white space-y-6 lg:space-y-8 w-full lg:w-2/3">
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight">
              Login to Empower Your Farm
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
              Gain full access to advanced module — from soil analysis and 
Take control of your farm with CROP ERP’s all-in-one solution.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Get Started with Modules
            </button>
          </div>

          {/* Right Side placeholder (keeps right half available for cards/video) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            {/* Place your cards or right-side content here */}
          </div>

        </div>
      </div>
    </div>
  );
}
